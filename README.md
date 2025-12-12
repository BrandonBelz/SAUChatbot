# SAUChatbot

A small multi-agent RAG (Retrieval-Augmented Generation) chatbot for Southern Adventist University built with LangChain-style components, Ollama embeddings/LLM, and a FAISS vectorstore. The project provides a Gradio chat UI (`app.py`) and the core workflow in `southern_chatbot.py`. A helper `vector_db.py` creates a local FAISS index from files in the `DATA/` folder.

## Included files
- `app.py` — Gradio ChatInterface that exposes the chatbot UI.
- `southern_chatbot.py` — Core multi-agent RAG workflow and public function `run_multi_agent_system`.
- `vector_db.py` — Builds a FAISS vectorstore from `DATA/pdfs` and `DATA/home.html`.
- `environment.yml` — Conda environment specification used to reproduce the development environment.

## Requirements
- Conda (to create the provided conda environment)
- Ollama (local model runtime) and the required Ollama models used in the code:
  - `qwen2.5:14b` (LLM in `southern_chatbot.py`)
  - `nomic-embed-text` (embeddings model in `southern_chatbot.py` & `vector_db.py`)
  For Ollama installation and model management see: [https://ollama.com/docs/](https://docs.ollama.com/)
- Files to index placed under `DATA/`:
  - `DATA/pdfs/` (PDF files)
  - `DATA/home.html` (HTML document)

Note: The conda environment includes `faiss-cpu` and many other dependencies via pip in `environment.yml`. Adjust versions as needed for your platform.

## Setup

1. Create the conda environment (from repo root):
   ```
   conda env create -f environment.yml
   conda activate langchain_southern
   ```

2. Install and run Ollama following their docs (https://ollama.com/docs/) and ensure the models referenced in the code are available.

3. Provide the documents to index:
   - Put PDF files under `DATA/pdfs/`
   - Place the HTML file at `DATA/home.html`

## Building or Loading the Vector Store
- On first run, the code attempts to load a local FAISS index folder named `faiss_index`.
- If `faiss_index` does not exist, `southern_chatbot.py` will import `create_faiss` from `vector_db.py` and build the index from files in `DATA/` (this requires the files listed above and the unstructured loaders).

To build explicitly:
```bash
python -c "from vector_db import create_faiss; create_faiss()"
```
This will create `faiss_index/`.

## Running the App

Run the Gradio app:
```
python app.py
```
This launches a local Gradio chat interface. The app uses `run_multi_agent_system` from `southern_chatbot.py` as the chat function.

You can also run the example in `southern_chatbot.py` directly to test the workflow from the command line:
```
python southern_chatbot.py
```

## Behavior notes
- The system uses a two-step agent workflow:
  1. Query refinement (creates a refined retrieval query).
  2. Answer generation (retrieves relevant documents and generates the final response).
- The assistant is instructed to answer only from the knowledge base and avoid fabricating information.
- If the FAISS index is absent, the repository will attempt to create it from `DATA/`. Make sure required files and loaders are present.

## Troubleshooting
- If the app cannot find Ollama models, confirm the Ollama daemon is running and the models are installed (see https://ollama.com/docs/).
- If FAISS fails to load or build, confirm `faiss-cpu` is installed in the environment and that `DATA/` contains indexable files.
- Some dependencies in `environment.yml` are pinned and may need adjustment for your OS or newer package versions.

## Contributing
Small project — feel free to open issues or PRs. Typical improvements:
- Add CI or tests
- Add docs for model setup (Ollama)
- Add sample data for easier local testing

## License
Choose a license for the repository (e.g., MIT, Apache-2.0). Add a `LICENSE` file at the repo root if you want to publish under a specific license.
