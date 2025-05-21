from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

class DocumentProcessor:
    def __init__(self, markdown_path: str, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.markdown_path = markdown_path
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def load_document(self):
        loader = UnstructuredMarkdownLoader(self.markdown_path)
        data = loader.load()
        if not data or not isinstance(data[0], Document):
            raise ValueError("Failed to load a valid Document.")
        return data

    def split_document(self, data):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap
        )
        return text_splitter.split_documents(data)
