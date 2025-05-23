import os
from dotenv import load_dotenv
from langchain import hub
from langchain_core.runnables import RunnablePassthrough

class RAGPipeline:
    def __init__(self, vectorstore):
        load_dotenv()
        self.vectorstore = vectorstore
        self.retriever = vectorstore.as_retriever()
        self.prompt = hub.pull("rlm/rag-prompt")

    def get_retriever(self):
        return self.retriever

    def get_prompt(self):
        return self.prompt
