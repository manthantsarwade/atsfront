import pdfplumber
import sys

def extract_text_with_pdfplumber(file_path):
    """Extracts text from a PDF using pdfplumber, attempting to preserve layout."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                page_text = page.extract_text(x_tolerance=2, y_tolerance=2) # tolerances can be adjusted
                if page_text:
                    text += page_text
                    # Add a page separator for multi-page documents if desired
                    if page_num < len(pdf.pages) - 1:
                        text += "\n\n--- Page Break ---\n\n"
        return text
    except Exception as e:
        print(f"Error processing file {file_path} with pdfplumber: {e}", file=sys.stderr)
        sys.exit(1) # Exit with error code

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python parse_resume.py <file_path>", file=sys.stderr)
        sys.exit(1)

    file_path = sys.argv[1]
    extracted_text = extract_text_with_pdfplumber(file_path)
    if extracted_text:
        print(extracted_text) # Print extracted text to stdout 