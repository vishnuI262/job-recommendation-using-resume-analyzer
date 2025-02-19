import re
import sys
import pdfplumber
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def extract_text_from_pdf(pdf_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:  # Check if extract_text returns None
                    text += page_text
                else:
                    logging.warning(f"No text found on page {page.page_number}")
            return text
    except Exception as e:
        error_message = f"Error extracting text: {str(e)}"
        logging.error(error_message)
        print(json.dumps({"success": False, "error": error_message}))
        sys.exit(1)

job_titles = {
    "Software Engineer": [
        "python", "java", "c++", "javascript", "git", "docker", "algorithms",
        "data structures", "RESTful APIs", "agile methodologies"
    ],
    "Data Scientist": [
        "python", "r", "sql", "machine learning", "data visualization",
        "statistical analysis", "pandas", "numpy", "tensorflow", "deep learning"
    ],
    "Web Developer": [
        "html", "css", "javascript", "react", "angular",
        "vue.js", "responsive design", "bootstrap", "jquery",
        "version control (git)"
    ],
    "Mobile Developer": [
        "swift", "kotlin", "java", "react native",
        "flutter", "mobile UI/UX design",
        "API integration", "unit testing"
    ],
    "Machine Learning Engineer": [
        "python", "tensorflow", "pytorch",
        "scikit-learn", "model deployment",
        "data preprocessing", "feature engineering",
        "NLP (Natural Language Processing)",
        "computer vision"
    ],
    "Data Analyst": [
        "sql", "excel", "tableau",
        "data cleaning", "data visualization",
        "statistical analysis",
        "business intelligence tools",
        "communication skills"
    ],
    "UX Designer": [
        "figma", "user research",
        "wireframing",  "prototyping",
        "usability testing","interaction design",
        "information architecture"
    ],
    "UI Designer": [
        "figma","adobe xd","visual design",
        "typography","color theory",
        "design systems","branding"
    ],
    "Data Engineer": [
        "sql","spark","etl","data warehousing",
        "big data technologies","cloud storage",
        "data modeling","apache kafka"
    ],
    "Cloud Engineer": [
        "aws","azure","gcp","docker",
        "kubernetes","terraform",
        "cloud architecture","CI/CD pipelines"
    ],
    "DevOps Engineer": [
        "docker","kubernetes","ci/cd",
        "ansible","monitoring tools",
        "cloud services","scripting languages"
    ],
    "Frontend Developer": [
        "html","css","javascript",
        "react","angular",
        "vue.js","responsive design"
    ],
    "Backend Developer": [
        "python","node.js","java",
        "RESTful APIs","database management",
        "microservices architecture"
    ],
    "Full Stack Developer": [
        "html","css","javascript",
        "node.js","express.js",
        "RESTful APIs","database integration"
    ],
    "Business Analyst": [
        "requirements gathering","process modeling",
        "data analysis","stakeholder communication",
        "project management tools"
    ],
    "Project Manager": [
        "agile methodologies","project planning",
        "risk management","budget management",
        "scheduling tools (e.g., Jira, Trello)"
    ],
    "QA Engineer": [
        "testing methodologies","automation testing",
        "scripting languages (e.g., Python, Java)",
        "bug tracking tools (e.g., JIRA)",
        "performance testing"
    ],
    "Technical Support Specialist": [
        "troubleshooting techniques","customer support",
        "technical documentation","problem-solving skills"
    ],
    "Network Administrator": [
        "network protocols (TCP/IP)","firewalls",
        "VPNs (Virtual Private Networks)","network security measures"
    ],
    "Database Administrator": [
        "sql","database management systems (DBMS)",
        "performance tuning","backup and recovery strategies"
    ],
    "Game Developer": [
        "unity","c#","game design principles",
        "scripting languages (e.g., C++)",
        "3D modeling and animation software"
    ],
    "Cybersecurity Analyst": [
        "threat analysis techniques","security protocols",
        "intrusion detection systems (IDS)","incident response planning"
    ],
    "Research Scientist": [
        "data analysis", "experimental design",
        "statistical software (e.g., R, SPSS)",
        "scientific writing", "hypothesis testing"
    ],
    "Statistician": [
        "statistical modeling", "data analysis",
        "probability theory", "data visualization",
        "R", "hypothesis testing"
    ]
}

def recommend_job(resume_text):
    try:
        recommendations = []
        for job, keywords in job_titles.items():
            match_count = sum([1 for keyword in keywords if re.search(r'\b' + re.escape(keyword.lower()) + r'\b', resume_text.lower())])
            if match_count >= 2:
                recommendations.append(job)
        return recommendations
    except Exception as e:
        error_message = f"Error recommending jobs: {str(e)}"
        logging.error(error_message)
        print(json.dumps({"success": False, "error": error_message}))
        sys.exit(1)

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"success": False, "error": "PDF path not provided"}))
            sys.exit(1)

        pdf_path = sys.argv[1]
        text = extract_text_from_pdf(pdf_path)

        if not text:  # Ensure text is not empty
            print(json.dumps({"success": False, "error": "Could not extract text from PDF"}))
            sys.exit(1)

        recommendations = recommend_job(text)
        print(json.dumps({"success": True, "recommendations": recommendations}))
    except Exception as e:
        error_message = f"Unexpected error: {str(e)}"
        logging.error(error_message)
        print(json.dumps({"success": False, "error": error_message}))
        sys.exit(1)
