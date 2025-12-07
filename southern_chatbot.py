from typing import TypedDict, List, Tuple
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langgraph.graph import StateGraph, END
from langchain_core.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS

# ============================================================================
# Configuration & Initialization
# ============================================================================

LLM = ChatOllama(model="qwen2.5:14b")
EMBEDDINGS = OllamaEmbeddings(model="nomic-embed-text")

try:
    VECTORSTORE = FAISS.load_local(
        "faiss_index", 
        EMBEDDINGS, 
        allow_dangerous_deserialization=True
    )
except:
    from vector_db import create_faiss
    VECTORSTORE = create_faiss()

RETRIEVER = VECTORSTORE.as_retriever(search_kwargs={"k": 10})

# ============================================================================
# State Management
# ============================================================================

class ConversationHistory(List[Tuple[str, str]]):
    """Maintains chat history as (user_query, assistant_response) pairs."""
    
    def __str__(self) -> str:
        formatted = []
        for user_msg, assistant_msg in self:
            formatted.append(f"User: {user_msg}\nAssistant: {assistant_msg}")
        return "\n\n".join(formatted)


class AgentState(TypedDict):
    """Shared state passed between workflow agents."""
    user_query: str
    conversation_history: ConversationHistory
    retrieved_documents: List[str]
    refined_query: str
    final_response: str
    next_step: str

# ============================================================================
# Prompt Templates
# ============================================================================

QUERY_REFINEMENT_PROMPT = PromptTemplate(
    template="""Given the conversation history and current user query, create an improved search query that will effectively retrieve relevant information from the knowledge base.

Conversation History: {history}

Current Query: {query}

Write only the improved query. Do NOT include any prefix, label, or explanation.""",
    input_variables=["history", "query"],
)

ANSWER_GENERATION_PROMPT = PromptTemplate(
    template="""You are a helpful assistant for Southern Adventist University. Answer the user's question based solely on the provided knowledge base content.

Guidelines:
- Provide comprehensive, accurate answers
- If information is not in the knowledge base, clearly state that you don't know
- Never invent or assume information not explicitly stated in the context
- Be friendly and professional

Conversation History:
{history}

User Question: {query}

Knowledge Base Context:
{context}

Answer:""",
    input_variables=["history", "query", "context"],
)

# ============================================================================
# Agent Nodes
# ============================================================================

def coordinator_agent(state: AgentState) -> AgentState:
    """Routes workflow to appropriate next step."""
    if not state.get("refined_query"):
        state["next_step"] = "refine_query"
        print("→ Coordinator: Routing to query refinement")
    elif not state.get("final_response"):
        state["next_step"] = "generate_answer"
        print("→ Coordinator: Routing to answer generation")
    else:
        state["next_step"] = "complete"
        print("→ Coordinator: Workflow complete")
    
    return state


def query_refinement_agent(state: AgentState) -> AgentState:
    """Refines user query based on conversation context for better retrieval."""
    print("\nQuery Refinement Agent")
    print(f"   Original: {state['user_query']}")
    
    prompt_text = QUERY_REFINEMENT_PROMPT.format(
        history=state["conversation_history"],
        query=state["user_query"]
    )
    
    response = LLM.invoke(prompt_text)
    state["refined_query"] = str(response.content)
    
    print(f"   Refined:  {state['refined_query']}\n")
    
    return state


def answer_generation_agent(state: AgentState) -> AgentState:
    """Retrieves relevant documents and generates final answer."""
    print("Answer Generation Agent")
    print(f"   Searching with: {state['refined_query']}")
    
    # Retrieve documents using refined query
    docs = RETRIEVER.invoke(state["refined_query"])
    doc_texts = [doc.page_content for doc in docs]
    state["retrieved_documents"] = doc_texts
    
    print(f"   Retrieved {len(doc_texts)} documents")
    
    # Generate answer
    context = "\n\n".join(doc_texts)
    prompt_text = ANSWER_GENERATION_PROMPT.format(
        history=state["conversation_history"],
        query=state["user_query"],
        context=context
    )
    
    print("   Generating answer...")
    response = LLM.invoke(prompt_text)
    state["final_response"] = str(response.content)
    
    print(f"   Answer generated ({len(state['final_response'])} chars)\n")
    
    return state

# ============================================================================
# Workflow Construction
# ============================================================================

def build_workflow():
    """Constructs and compiles the multi-agent workflow graph."""
    workflow = StateGraph(AgentState)
    
    # Register agents
    workflow.add_node("coordinator", coordinator_agent)
    workflow.add_node("refine_query", query_refinement_agent)
    workflow.add_node("generate_answer", answer_generation_agent)
    
    # Set entry point
    workflow.set_entry_point("coordinator")
    
    # Define routing from coordinator
    workflow.add_conditional_edges(
        "coordinator",
        lambda state: state["next_step"],
        {
            "refine_query": "refine_query",
            "generate_answer": "generate_answer",
            "complete": END,
        },
    )
    
    # Return to coordinator after each agent
    workflow.add_edge("refine_query", "coordinator")
    workflow.add_edge("generate_answer", "coordinator")
    
    return workflow.compile()

# ============================================================================
# Public Interface
# ============================================================================

def run_multi_agent_system(
    query: str, 
    history: ConversationHistory | None = None
) -> str:
    """
    Execute the multi-agent RAG workflow for a given query.
    
    Args:
        query: User's question
        history: Optional conversation history
        
    Returns:
        Generated answer as string
    """
    history = history or ConversationHistory()
    
    print("=" * 70)
    print("Multi-Agent RAG System")
    print("=" * 70)
    print(f"Query: {query}\n")
    
    initial_state: AgentState = {
        "user_query": query,
        "conversation_history": history,
        "retrieved_documents": [],
        "refined_query": "",
        "final_response": "",
        "next_step": "",
    }
    
    workflow = build_workflow()
    final_state = workflow.invoke(initial_state)
    
    print("=" * 70)
    print("Complete")
    print("=" * 70)
    
    return final_state["final_response"]


# ============================================================================
# Example Usage
# ============================================================================

if __name__ == "__main__":
    test_query = (
        "As a computer science major, how is a minor in security "
        "different from a security concentration?"
    )
    
    result = run_multi_agent_system(test_query, ConversationHistory())
    print(f"\nFinal Answer:\n{result}")