import gradio as gr
from gradio import themes
from southern_chatbot import run_multi_agent_system

demo = gr.ChatInterface(
    fn=run_multi_agent_system,
    title="Southern Adventist University Chatbot",
    description="Ask me anything about SAU courses, programs, and policies!",
    theme=themes.Monochrome(),
    cache_examples=False,
    submit_btn="Send",
    chatbot=gr.Chatbot(
        height=650,
        show_label=False,
        show_copy_button=True
    ),
    textbox=gr.Textbox(
        placeholder="Type your question here...",
        container=False,
        scale=7
    ),
    analytics_enabled=False
)

demo.launch(
    share=False,
    show_error=True
)