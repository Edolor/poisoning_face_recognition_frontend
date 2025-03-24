"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isAttacking, setIsAttacking] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="py-10">
      <main>
        <h1 className="text-4xl text-center underline mb-5">
          Adversarial Attack on Face Recognition
        </h1>
        <form action="#" method="POST" className="flex flex-col gap-2">
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
                    defaultValue={0.5}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value < 0 || value > 1) {
                        alert("Error: Value must be between 0 and 1");
                      }
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
              </div>

              {/* RADIO BUTTONS FOR ATTACK TYPES */}
              <div className="flex flex-col gap-2 px-5 py-5 border border-black rounded-sm">
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
                  <div>
                    <p>Attack Type:</p>
                    <div className="space-x-2">
                      <input
                        type="radio"
                        name="attacktype"
                        id="fgsm"
                        value="fgsm"
                      />
                      <label htmlFor="fgsm">FGSM</label>
                    </div>
                    <div className="space-x-2">
                      <input
                        type="radio"
                        name="attacktype"
                        id="pgd"
                        value="pgd"
                      />
                      <label htmlFor="pgd">PDG</label>
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
                  <div className="border border-black w-40 h-40">&nbsp;</div>
                </div>
              )}

              <div>
                <p className="underline">Final Image</p>
                <div className="border border-black w-60 h-60">
                  {selectedImage != null && (
                    <Image
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected Image"
                      className="h-full w-full object-cover"
                      width={220}
                      height={40}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <button className="bg-yellow-400 mt-5 cursor-pointer self-center text-black py-3 px-20 hover:outline hover:outline-2 outline-offset-2 outline-yellow-500">
            Make Inference
          </button>
        </form>
      </main>
    </div>
  );
}
