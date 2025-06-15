import { useMutation, useQuery } from "@tanstack/react-query"
import { FormEvent, useRef } from "react"
import Select, { SelectInstance } from "react-select"
import { useLoggedInAuth } from "../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/common/Button"
import { Input } from "../components/common/Input"

export function NewChannelPage() {
  const { streamChat, user } = useLoggedInAuth()
  const navigate = useNavigate()
  const createChannel = useMutation({
    mutationFn: ({
      name,
      memberIds,
      imageUrl,
    }: {
      name: string
      memberIds: string[]
      imageUrl?: string
    }) => {
      if (streamChat == null) throw Error("Not connected")

      const channelData = {
        name,
        image: imageUrl,
        members: [user.id, ...memberIds],
      }

      return streamChat.channel("messaging", crypto.randomUUID(), channelData).create()
    },
    onSuccess() {
      navigate("/messages")
    },
  })
  const nameRef = useRef<HTMLInputElement>(null)
  const imageUrlRef = useRef<HTMLInputElement>(null)
  const memberIdsRef =
    useRef<SelectInstance<{ label: string; value: string }>>(null)

  const users = useQuery({
    queryKey: ["stream", "users"],
    queryFn: () => {
      const filter = { id: { $ne: user.id } };
      return streamChat!.queryUsers(filter as any, { name: 1 });
    },
    enabled: streamChat != null,
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const name = nameRef.current?.value
    const imageUrl = imageUrlRef.current?.value
    const selectOptions = memberIdsRef.current?.getValue()
    if (
      name == null ||
      name === "" ||
      selectOptions == null ||
      selectOptions.length === 0
    ) {
      return
    }

    createChannel.mutate({
      name,
      imageUrl,
      memberIds: selectOptions.map(option => option.value),
    })
  }

  return (
    <div className="flex justify-center items-center h-full p-4">
      <div className="max-w-md w-full">
        <div className="shadow bg-gray-900 p-6 rounded-lg border border-gray-700/75">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            New Conversation
          </h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end text-white"
          >
            <label htmlFor="name">Name</label>
            <Input id="name" required ref={nameRef} />
            <label htmlFor="imageUrl">Image Url</label>
            <Input id="imageUrl" ref={imageUrlRef} />
            <label htmlFor="members">Members</label>
            <Select
              ref={memberIdsRef}
              id="members"
              required
              isMulti
              className="w-full text-black"
              isLoading={users.isLoading}
              options={users.data?.users.map(user => {
                return { value: user.id, label: user.name || user.id }
              })}
            />
            <Button
              disabled={createChannel.isPending}
              type="submit"
              className="col-span-full"
            >
              {createChannel.isPending ? "Loading.." : "Create"}
            </Button>
          </form>
        </div>
        <div className="mt-2 justify-center flex gap-3">
          <Link to="/messages" className="text-twitter-blue hover:underline underline-offset-2">Back</Link>
        </div>
      </div>
    </div>
  )
}