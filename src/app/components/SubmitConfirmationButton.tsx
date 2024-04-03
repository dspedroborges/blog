"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ name, loadingName }: { name: string, loadingName: string }) {
    const { pending } = useFormStatus();
    const [showConfirmation, setShowConfirmation] = useState(false);

    return (
        <>
            {
                !showConfirmation ? (
                    <span onClick={() => {
                        setShowConfirmation(true);
                        setTimeout(() => {
                            setShowConfirmation(false);
                        }, 3000);
                    }} className="mx-auto block text-center cursor-pointer bg-gray-100 text-black p-2 rounded-xl border border-gray-400 hover:bg-indigo-600 hover:text-white transition-all w-full lg:w-1/3">
                        {name}
                    </span>
                ) : (
                    <button className="block mx-auto bg-red-100 text-black p-2 rounded-xl border border-gray-400 hover:bg-red-800 hover:text-white transition-all w-full lg:w-1/3">
                        {pending ? loadingName : "Tenho certeza"}
                    </button>
                )
            }
        </>
    )
}