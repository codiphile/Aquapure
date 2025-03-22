export async function generateImageAnalysis(
  imageUrl: string,
  description: string
) {
  try {
    // In a real application, this would call the Gemini API
    // For this demo we'll return a mock response

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return a mock analysis based on the description
    const descriptionLower = description.toLowerCase();

    let analysis = "Based on the uploaded image and description, ";

    if (
      descriptionLower.includes("stagnant") ||
      descriptionLower.includes("standing")
    ) {
      analysis +=
        "this appears to be a case of stagnant water accumulation. The standing water creates an ideal breeding ground for mosquitoes and other disease vectors. This situation poses a moderate health risk to the community. The water should be drained and the area should be treated to prevent future accumulation. Regular maintenance of this area is recommended.";
    } else if (
      descriptionLower.includes("leak") ||
      descriptionLower.includes("pipe")
    ) {
      analysis +=
        "there is clearly a water leakage issue from damaged infrastructure. This continuous leakage is wasteful and could damage surrounding structures or road foundations over time. The severity appears to be medium to high based on the flow rate visible. Immediate repairs are needed to stop the water loss and prevent further damage.";
    } else if (
      descriptionLower.includes("pollut") ||
      descriptionLower.includes("contaminat")
    ) {
      analysis +=
        "there are visible signs of water pollution. The discoloration and floating debris indicate potential chemical or biological contamination. This presents a severe environmental hazard and potential health risk to humans and wildlife. Water quality testing is urgently needed, followed by appropriate remediation measures.";
    } else if (
      descriptionLower.includes("flood") ||
      descriptionLower.includes("overflow")
    ) {
      analysis +=
        "this is a flooding situation that requires immediate attention. The overflow of water into non-designated areas suggests drainage system failures or excessive rainfall. This presents high risk to property and potentially to people's safety. Emergency drainage measures should be implemented, followed by assessment of the drainage infrastructure.";
    } else {
      analysis +=
        "this appears to be a water-related issue that requires attention. Based on visual assessment, there are signs of water quality or management problems that could impact the local environment and community. Further investigation is recommended to determine the exact nature and severity of the problem.";
    }

    return {
      text: analysis,
      success: true,
    };
  } catch (error) {
    console.error("Error generating analysis:", error);
    return {
      text: "Failed to analyze the image. Please try again.",
      success: false,
    };
  }
}
