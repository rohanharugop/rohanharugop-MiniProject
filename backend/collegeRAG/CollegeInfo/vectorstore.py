from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma

class VectorStoreBuilder:
    def __init__(self, embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.embedding_model = embedding_model
        self.embeddings = HuggingFaceEmbeddings(model_name=self.embedding_model)

    def create_vector_store(self, splits):
        vectorstore = Chroma.from_documents(documents=splits, embedding=self.embeddings)
        return vectorstore
