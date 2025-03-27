"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isAttacking, setIsAttacking] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const [epsilon, setEpsilon] = useState(0.1);
  const [attackType, setAttackType] = useState("fgsm");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noiseImage, setNoiseImage] = useState("");
  const [noisyImage, setNoisyImage] = useState("");

  // List of images in the /public/images folder
  const randomImages = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/2_1.jpg",
    "/images/2_2.jpg",
    "/images/2_3.jpg",
    "/images/3.jpg",
    "/images/5.jpg",
    "/images/7.jpeg",
    "/images/8.jpeg",
    "/images/10.jpeg",
  ];

  const fetchNoise = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("attack_type", attackType);
    formData.append("epsilon", epsilon.toString());

    try {
      const response = await fetch("http://127.0.0.1:8000/generate_noise", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setNoiseImage(() => data.noise_image);
      setNoisyImage(() => data.noisy_image);
    } catch (error) {
      console.error("Error fetching noise:", error);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      fetchNoise();
    }
  }, [selectedImage, epsilon, attackType]);

  const handleInference = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    const new_eps = isAttacking == false ? 0 : epsilon;
    formData.append("file", selectedImage);
    formData.append(
      "input_data",
      JSON.stringify({ attack_type: attackType, epsilon: new_eps })
    );

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Response:", data);
      setResponse(() => data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(() => false);
    }
  };

  const handleRandomImage = () => {
    const randomImage =
      randomImages[Math.floor(Math.random() * randomImages.length)];
    setSelectedImage(() => new Blob([randomImage]));
  };

  return (
    <div className="py-10 flex gap-10 px-10 bg-gray-100 min-h-screen font-sans text-gray-900">
      {/* Explanatory Text */}
      <aside className="w-1/2 border-r pr-5">
        <h2 className="text-3xl font-bold mb-4">
          Understanding Adversarial Attacks on Face Recognition
        </h2>
        <p>
          This system demonstrates <strong>adversarial attacks</strong> on a{" "}
          <strong>face recognition model</strong>. The model is trained on the
          faces of <strong>Mena, Zahra and Parsa</strong>. Adversarial attacks
          add <span className="text-red-600">small noise</span> to an image to
          trick the model into misclassifying it.
        </p>

        <h3 className="text-xl font-bold mt-4">What is ε (Epsilon)?</h3>
        <p>
          The <strong>ε (epsilon)</strong> value controls the strength of the
          attack. Higher values increase noise, making attacks more effective
          but also more visible.
        </p>

        <h3 className="text-xl font-bold mt-4">Types of Attacks</h3>
        <p>
          <strong>FGSM (Fast Gradient Sign Method):</strong> Quick attack that
          perturbs pixels in the direction of the gradient.
        </p>
        <p>
          <strong>PGD (Projected Gradient Descent):</strong> More powerful,
          iterative attack that refines the noise over multiple steps.
        </p>

        <h3 className="text-xl font-bold mt-4">How to Use the System</h3>
        <ol className="list-decimal pl-5">
          <li>Select an image of a face.</li>
          <li>Set the ε (epsilon) value.</li>
          <li>Enable attacking.</li>
          <li>Choose between FGSM and PGD.</li>
          <li>View the noise and adversarial image.</li>
          <li>Check the prediction result.</li>
        </ol>
      </aside>

      <main className="w-1/2">
        {/* <h1 className="text-4xl text-center underline mb-5">
          Adversarial Attack on Face Recognition
        </h1> */}
        <form
          action="#"
          onSubmit={handleInference}
          method="POST"
          className="flex flex-col gap-2"
        >
          <div className="flex justify-center items-center gap-20">
            <div className="left flex flex-col gap-6">
              {isAttacking && (
                <div className="flex flex-col">
                  <label htmlFor="epsilon">Enter value for ε(0-1):</label>
                  <input
                    type="number"
                    name="epsilon"
                    id="epsilon"
                    className="border border-black rounded-sm p-2"
                    min={0}
                    max={1}
                    step={0.01}
                    value={epsilon}
                    onChange={(e) => {
                      // const value = parseFloat(e.target.value);
                      setEpsilon(parseFloat(e.target.value));
                      // if (value < 0 || value > 1) {
                      //   alert("Error: Value must be between 0 and 1");
                      // } else {
                      // }
                    }}
                  />
                </div>
              )}

              <div className="image">
                <label htmlFor="image" className="cursor-pointer rounded-sm">
                  {selectedImage ? (
                    <div className="flex flex-col border border-2 hover:bg-gray-100 items-center">
                      {selectedImage != null && (
                        <Image
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected Image"
                          className="h-50 object-cover"
                          width={220}
                          height={40}
                        />
                      )}

                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#00000"
                        >
                          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                        </svg>
                        <span>Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col border border-2 py-2 hover:bg-gray-100 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="60px"
                        viewBox="0 -960 960 960"
                        width="60px"
                        fill="#00000"
                      >
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                      </svg>
                      <span>Add Image</span>
                    </div>
                  )}
                </label>

                <input
                  type="file"
                  className="hidden"
                  name="image"
                  id="image"
                  onChange={(e: any) => setSelectedImage(e.target.files[0])}
                />

                {/* Random Image Button */}
                {/* <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded mt-2"
                  onClick={handleRandomImage}
                >
                  Select Random Image
                </button> */}
              </div>

              {/* RADIO BUTTONS FOR ATTACK TYPES */}
              <div className="flex flex-col px-5 py-5 border border-black rounded-sm">
                <p>Attacking:</p>
                <div className="space-x-2">
                  <input
                    type="radio"
                    name="attacking"
                    id="attack-yes"
                    value="Yes"
                    checked={isAttacking}
                    onChange={() => setIsAttacking(true)}
                  />
                  <label htmlFor="attack-yes">Yes</label>
                </div>
                <div className="space-x-2">
                  <input
                    type="radio"
                    name="attacking"
                    id="attack-no"
                    value="No"
                    checked={!isAttacking}
                    onChange={() => setIsAttacking(false)}
                  />
                  <label htmlFor="attack-no">No</label>
                </div>

                {isAttacking && (
                  <div className="pt-1">
                    <p>Attack Type:</p>
                    <div className="space-x-2">
                      <input
                        type="radio"
                        name="attacktype"
                        id="fgsm"
                        value="fgsm"
                        checked={attackType === "fgsm"}
                        onChange={() => setAttackType("fgsm")}
                      />
                      <label htmlFor="fgsm">FGSM</label>
                    </div>
                    <div className="space-x-2">
                      <input
                        type="radio"
                        name="attacktype"
                        id="pgd"
                        value="pgd"
                        checked={attackType === "pgd"}
                        onChange={() => setAttackType("pgd")}
                      />
                      <label htmlFor="pgd">PGD</label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-4">
              {isAttacking && (
                <div>
                  <p className="underline">Noise Generated</p>
                  <div className={`border border-black w-40 h-40`}>
                    {noiseImage ? (
                      <Image
                        src={noiseImage}
                        alt="Noise"
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <p>
                        {selectedImage != null
                          ? "Loading..."
                          : "No Image Selected"}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="underline">Final Image</p>
                <div className="border border-black w-60 h-60">
                  {/* {selectedImage != null && ( */}
                  {selectedImage != null && (
                    <>
                      {epsilon === 0 ||
                        (isAttacking == false && (
                          <Image
                            src={
                              epsilon === 0 || isAttacking == false
                                ? URL.createObjectURL(selectedImage)
                                : noisyImage
                            }
                            alt="Normal Image"
                            // src={URL.createObjectURL(selectedImage)}
                            // alt="Selected Image"
                            className="h-full w-full object-cover"
                            width={220}
                            height={40}
                          />
                        ))}

                      {epsilon != 0 && isAttacking != false && noisyImage && (
                        <Image
                          src={noisyImage}
                          alt="Noisy Image"
                          // src={URL.createObjectURL(selectedImage)}
                          // alt="Selected Image"
                          className="h-full w-full object-cover"
                          width={220}
                          height={40}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              {response && (
                <div className="mt-5 p-4 border border-black">
                  <h2 className="text-xl font-bold">Prediction Result:</h2>
                  <p>{response?.prediction}</p>

                  {/* <h2 className="text-xl font-bold mt-3">Confidence:</h2>
                  <p>{response?.confidence}</p> */}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-yellow-400 font-semibold rounded-lg font-gray-400 mt-5 cursor-pointer self-center text-black py-3 px-20 hover:outline hover:outline-2 outline-offset-2 outline-yellow-500 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loader"></span> Processing...
              </>
            ) : (
              "Make Inference"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
