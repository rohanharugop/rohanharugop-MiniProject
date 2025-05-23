import os
from dotenv import load_dotenv
load_dotenv()

from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain_core.runnables import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser


persist_directory=r'./chroma_db'
# Load a local embedding model from Hugging Face
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Load the existing Chroma vector store
vectorstore = Chroma(
    persist_directory=persist_directory,
    embedding_function=embeddings
)

retriever = vectorstore.as_retriever()
from langchain import hub
prompt = hub.pull("rlm/rag-prompt")

def format_docs(docs):
    return "\n".join(doc.page_content for doc in docs)

from langchain.chat_models import ChatOpenAI

api_key = os.environ.get('Groq_APIKey', None) 

llm = ChatOpenAI(
    model="llama3-70b-8192",  # or use "llama3-70b-8192"
    openai_api_key=api_key,
    openai_api_base="https://api.groq.com/openai/v1"
)

from langchain.chains import RetrievalQA
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

retriever =vectorstore.as_retriever()

rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True
)

import json

def parse_partial_json_array(raw_json_str):
    """
    Parses a JSON-like array string and returns a list of valid JSON objects,
    skipping any malformed entries.

    Args:
        raw_json_str (str): The raw string containing a list of JSON objects.

    Returns:
        list: A list of successfully parsed JSON objects (dicts).
    """
    # Remove the outer brackets and split by '},'
    raw_entries = raw_json_str.strip()[1:-1].split('},')
    valid_objects = []

    for i, entry in enumerate(raw_entries):
        entry = entry.strip()
        if not entry.endswith('}'):
            entry += '}'
        try:
            obj = json.loads(entry)
            valid_objects.append(obj)
        except json.JSONDecodeError:
            print(f"Skipping malformed JSON object at index {i}: {entry}")
    
    return valid_objects


def call_rag(prompt):
    response = rag_chain.invoke({"query": "Provide response in a deserializable JSON format only without any note for the query: " + prompt})
    return (parse_partial_json_array(response['result']))

if __name__ == '__main__':
    # response = rag_chain.invoke({"query": "In JSON format, Recommend 3 engineering courses offered by engineering colleges for a student who's intersted in maths and physics and has a general rank 0f 1500, calculate and include an average the cutoff pf the course you have selected. If any data is ambiguous, leave it and answer the rest of the question instead"})
    response=call_rag("Recommend 3 engineering courses offered by engineering colleges for a student who's intersted in maths and physics and has a general rank 0f 1500, calculate and include an average the cutoff pf the course you have selected. If any data is ambiguous, leave it and answer the rest of the question instead")
    print(response['result'])
