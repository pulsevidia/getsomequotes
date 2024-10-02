import os
import json
import PyPDF2
import pytesseract
from pdfminer.high_level import extract_text
from pdf2image import convert_from_path
from PIL import Image
import io


def list_pdf_files(directory):
    pdf_files = []
    for file in os.listdir(directory):
        if file.endswith('.pdf'):
            pdf_files.append(os.path.join(directory, file))
    return pdf_files


def extract_text_pdfminer(file_path):
    try:
        text = extract_text(file_path)
        return {"text": text}
    except Exception as e:
        print(f"Error extracting text with pdfminer from {file_path}: {e}")
        return {"error": str(e)}


def extract_text_pypdf2(file_path):
    try:
        reader = PyPDF2.PdfReader(file_path)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
        return {"text": text}
    except Exception as e:
        print(f"Error extracting text with PyPDF2 from {file_path}: {e}")
        return {"error": str(e)}


def extract_text_ocr(file_path):
    try:
        images = convert_from_path(file_path)
        text = ''
        for image in images:
            text += pytesseract.image_to_string(image)
        return {"text": text}
    except Exception as e:
        print(f"Error extracting text with OCR from {file_path}: {e}")
        return {"error": str(e)}


def convert_pdf_to_json(pdf_path):
    data = {
        "pdfminer": extract_text_pdfminer(pdf_path),
        "pypdf2": extract_text_pypdf2(pdf_path),
        "ocr": extract_text_ocr(pdf_path)
    }
    return data


def save_json(data, output_path):
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)


def main(input_dir, output_dir):
    pdf_files = list_pdf_files(input_dir)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for pdf_path in pdf_files:
        file_name = os.path.basename(pdf_path).replace('.pdf', '.json')
        output_path = os.path.join(output_dir, file_name)
        data = convert_pdf_to_json(pdf_path)
        save_json(data, output_path)
        print(f"Processed {pdf_path} and saved to {output_path}")


if __name__ == "__main__":
    input_directory = "./"  # Replace with your PDF directory path
    output_directory = "./"  # Replace with your JSON output directory path
    main(input_directory, output_directory)