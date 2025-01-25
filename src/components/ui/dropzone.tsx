'use client'

import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'
import { deleteCloudUrl } from '../lectures/action';

type DropzoneProps = {
    name: string;
    lectureId: number;
    setIsDialogOpen: (isOpen: true | false) => void;
    cid: string | null;
}

export function Dropzone(props: DropzoneProps) {
    const { name, lectureId, setIsDialogOpen, cid } = props; // Destructure the name from props
    console.log(name, lectureId)
    const router = useRouter()

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
      if (!acceptedFiles[0].name.endsWith('.pdf')) {
        toast.error('Only PDFs allowed!'); // Display the error message
        return; // Exit the function to prevent further execution
      }
      if (cid) {
        try {
          // Unpin the file from IPFS
          await fetch(`${process.env.NEXT_PUBLIC_URL!}/api/pinata/files?cid=${cid}`, {
            method: 'DELETE',
          })
          await deleteCloudUrl(lectureId)
        }
        catch (error) {
          console.log(error)
        }
      } 
      try {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0], `${name}.pdf`);
    
        // Pin the file to IPFS
        const uploadFile = await fetch(`${process.env.NEXT_PUBLIC_URL!}/api/pinata/files`, {
          method: 'POST',
          body: formData,
        })
        const data = await uploadFile.json()
        if (!data.IpfsHash) {
          throw new Error("IPFS Hash is missing in the Pinata response.");
        }

        await fetch(`${process.env.NEXT_PUBLIC_URL!}/api/update-ipfs-hash?lectureId=${lectureId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({url: data.IpfsHash})
        })
        if (cid) {
          toast.success('New file uploaded successfully!')
        } else {
          toast.success('File uploaded successfully!')
        }
        setIsDialogOpen(false)
        router.refresh()
      }
      catch (error) {
        console.log(error)
      }
    }, []);
    

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ? (
          <div className='flex w-full p-10 justify-center items-center border-solid border-2 border-[#0101bf] rounded-xl mt-2'>
            <p>Drop the files here ...</p>
          </div>
        ) : (
          <div className='flex w-full p-10 justify-center items-center border-dashed border-2 rounded-xl mt-2 transition duration-200 ease-in-out hover:border-solid hover:border-[#0101bf]'>
            <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
          </div>
        )
      }
    </div>
  )
}