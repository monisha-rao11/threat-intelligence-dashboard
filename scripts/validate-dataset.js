const fs = require("fs")
const path = require("path")

function validateDataset() {
  const csvPath = path.join(__dirname, "..", "data", "nlp_based_cyber_security_dataset.csv")

  if (!fs.existsSync(csvPath)) {
    console.error("❌ Dataset not found!")
    console.log("Please download the dataset from:")
    console.log("https://www.kaggle.com/datasets/hussainsheikh03/nlp-based-cyber-security-dataset")
    console.log("And place it in the data/ directory")
    process.exit(1)
  }

  const content = fs.readFileSync(csvPath, "utf-8")
  const lines = content.split("\n")
  const headers = lines[0].split(",")

  const requiredHeaders = [
    "Original Threat Description",
    "Cleaned Threat Description",
    "Threat Category",
    "Severity Score",
  ]

  const missingHeaders = requiredHeaders.filter(
    (header) => !headers.some((h) => h.trim().replace(/"/g, "").includes(header)),
  )

  if (missingHeaders.length > 0) {
    console.error("❌ Missing required columns:", missingHeaders)
    process.exit(1)
  }

  console.log("✅ Dataset validation passed!")
  console.log(`📊 Found ${lines.length - 1} data rows`)
  console.log("🚀 Ready to start the application")
}

validateDataset()
