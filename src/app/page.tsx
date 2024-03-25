"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (formData.username !== "" && formData.password !== "") {
      const res = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      })

      if (res?.ok) {
        router.push("/posts");
      } else {
        alert("Credenciais inválidas!");
      }
    }
  }

  if (session.status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center my-8">
        <button onClick={() => signOut()} className="bg-red-600 text-white rounded-xl p-2 mb-2 hover:bg-red-700">Logout</button>
        <div>Já autenticado.</div>
      </div>
    )
  }

  return (
    <>
      <Link href="/registro" className="block my-8 text-center hover:underline text-indigo-600">Ainda não tenho uma conta</Link>
      <h2 className="font-bold text-2xl text-center">Login</h2>
      <div className="h-1 bg-indigo-600 w-[100px] mx-auto my-4"></div>
      <form onSubmit={(e) => handleSubmit(e)} className="mx-auto border p-4 rounded-xl w-full lg:w-1/2 flex flex-col">
        <label htmlFor="cep" className="font-bold my-2">Nome de usuário: <span className="text-xs text-red-500">*</span></label>
        <input required={true} type="text" id="cep" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
        <label htmlFor="state" className="font-bold my-2">Senha: <span className="text-xs text-red-500">*</span></label>
        <input required={true} type="password" id="state" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <button className="p-4 border rounded-xl text-center cursor-pointer w-1/3 mx-auto my-4 bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-bold hover:opacity-95">Login</button>
      </form>
    </>
  );
}
