"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ name, loadingName }: { name: string, loadingName: string }) {
    const { pending } = useFormStatus();
    return <button className="bg-gray-100 text-black p-2 rounded-xl border border-gray-400 my-8 hover:bg-indigo-600 hover:text-white transition-all w-1/3 self-end">{pending ? loadingName : name }</button>
}