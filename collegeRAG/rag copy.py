import os
from dotenv import load_dotenv
load_dotenv()

from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain_core.runnables import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import PromptTemplate


persist_directory=r'./chroma_db'
# Load a local embedding model from Hugging Face
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Load the existing Chroma vector store
vectorstore = Chroma(
    persist_directory=persist_directory,
    embedding_function=embeddings
)

retriever = vectorstore.as_retriever()
# from langchain import hub
# prompt = hub.pull("rlm/rag-prompt")   

from langchain_core.prompts import PromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate


custom_template_str = """You are an expert assistant helping users extract structured information about universities and colleges from a knowledge base.

Based on the context provided, extract information and return it in the following JSON format:

College {
  name: string;
  CourseName: string;
  Fees: number;
  ExpectedKCETCutoff: number;
  Placement: string[];
}

- Respond **only** with a valid JSON object.
- Ensure all string values are enclosed in double quotes.
- Return `null` for any field that is not found in the context.
- Do not include any explanation or additional text.

Context:
{context}

Question:
{question}
"""



# Create a new PromptTemplate and HumanMessagePromptTemplate
new_prompt_template = PromptTemplate(input_variables=['context', 'question'], template=custom_template_str)
new_human_message = HumanMessagePromptTemplate(prompt=new_prompt_template)

# Create a new ChatPromptTemplate with the new message
custom_prompt = ChatPromptTemplate(messages=[new_human_message])







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
    chain_type_kwargs={"prompt": custom_prompt},
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


def call_rag(question):
    response = rag_chain.invoke({"query": question})
    print('\nResponse from RAG/LLM: \n',response['result'])
    return (parse_partial_json_array(response['result']))

if __name__ == '__main__':
    # response = rag_chain.invoke({"query": "In JSON format, Recommend 3 engineering courses offered by engineering colleges for a student who's intersted in maths and physics and has a general rank 0f 1500, calculate and include an average the cutoff pf the course you have selected. If any data is ambiguous, leave it and answer the rest of the question instead"})
    response=call_rag("Recommend 3 engineering courses offered by engineering colleges for a student who's intersted in maths and physics and has a general rank 0f 1500, calculate and include an average the cutoff pf the course you have selected. If any data is ambiguous, leave it and answer the rest of the question instead")
    print(response['result'])
