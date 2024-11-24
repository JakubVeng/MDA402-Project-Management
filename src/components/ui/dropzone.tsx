'use client'

import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { toast } from 'sonner';

type DropzoneProps = {
    name: string;
}

export function Dropzone(props: DropzoneProps) {
    const { name } = props; // Destructure the name from props

    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (!acceptedFiles[0].name.endsWith('.pdf')) {
        toast.error('Only PDFs allowed!'); // Display the error message
        return; // Exit the function to prevent further execution
      }

        const formData = new FormData();
        formData.append('file', acceptedFiles[0], `${name}.pdf`);
    
        // Make sure to use the correct path (e.g., '/api/upload' or the full path based on your app structure)
        fetch('/api/upload', {
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
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}