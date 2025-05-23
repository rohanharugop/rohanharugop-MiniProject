
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma


# Path to all .md files in the folder
markdown_path = "CollegeInfo/allinfo.md"
loader = UnstructuredMarkdownLoader(markdown_path)

from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma

def get_vectorstore(data_path):
    loader = UnstructuredMarkdownLoader(data_path)
    data = loader.load()

    assert len(data) == 1, "Loader should return a single Document"
    assert isinstance(data[0], Document), "Loaded data is not a Document"

    readme_content = data[0].page_content
    print("Sample content:\n", readme_content[:250])

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(data)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory="chroma_db"
    )
    vectorstore.persist()

    print(f"Stored {len(splits)} document chunks in the vectorstore.")

get_vectorstore("CollegeInfo/allinfo.md")
