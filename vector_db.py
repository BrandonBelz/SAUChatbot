from langchain_community.document_loaders import PyPDFDirectoryLoader, UnstructuredHTMLLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
from typing import List

def _create_vector_store(docs: List[Document], embeddings: OllamaEmbeddings):
    """Create and populate FAISS vector store"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=300,
    )
    splits = text_splitter.split_documents(
        docs
    )
    vectorstore = FAISS.from_documents(
        splits, embeddings
    )
    return vectorstore

def create_faiss() -> FAISS:
    embeddings = OllamaEmbeddings(model="nomic-embed-text")

    pdf_loader = PyPDFDirectoryLoader("DATA/pdfs")
    pdf_docs = pdf_loader.load()
    html_loader = UnstructuredHTMLLoader("DATA/home.html")
    html_docs = html_loader.load()
    docs = pdf_docs + html_docs
    
    vectorstore = _create_vector_store(docs, embeddings)
    vectorstore.save_local("faiss_index")
    return vectorstore