'use client'

import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { toast } from 'sonner';

type DropzoneProps = {
    name: string;
    lectureId: number;
}

export function Dropzone(props: DropzoneProps) {
    const { name, lectureId } = props; // Destructure the name from props

    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (!acceptedFiles[0].name.endsWith('.pdf')) {
        toast.error('Only PDFs allowed!'); // Display the error message
        return; // Exit the function to prevent further execution
      }

        const formData = new FormData();
        formData.append('file', acceptedFiles[0], `${name}.pdf`);
    
        fetch(`${process.env.NEXT_PUBLIC_URL!}/api/pinata/files?lectureId=${lectureId}`, {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              alert(data.error);
            } else {
              alert('File uploaded successfully!');
            }
          })
          .catch(error => {
            console.log(error);
            alert('Error uploading file.');
          });
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