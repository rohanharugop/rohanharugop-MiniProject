from document_processor import DocumentProcessor
from vectorstore import VectorStoreBuilder
from rag_pipeline import RAGPipeline

def main():
    # Step 1: Process documents
    doc_path = "CollegeInfo/allinfo.md"  # Make sure this path is correct in your environment
    processor = DocumentProcessor(markdown_path=doc_path)
    documents = processor.load_document()
    splits = processor.split_document(documents)

    # Step 2: Build vector store
    vector_builder = VectorStoreBuilder()
    vectorstore = vector_builder.create_vector_store(splits)

    # Step 3: Setup RAG pipeline
    rag_pipeline = RAGPipeline(vectorstore=vectorstore)

    # Example usage
    retriever = rag_pipeline.get_retriever()
    prompt = rag_pipeline.get_prompt()

    print("RAG Pipeline initialized.")
    print("Vector store document count:", vectorstore._collection.count())
    print("Prompt loaded:", prompt)

if __name__ == "__main__":
    main()
