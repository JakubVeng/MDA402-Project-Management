'use client'

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Button } from "./button";
import { ArrowBigRight, ArrowBigLeft } from 'lucide-react';
import { SpinnerCircular } from 'spinners-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const PdfViewer = ({ file }: { file: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  // Callback when PDF is successfully loaded
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const onLoadError = () => {
    return (
      <p>No file detected. Please upload the file.</p>
    )
  }

  return (
    <div className="pdf-viewer flex flex-col p-4 bg-[#f3f2fe] border-2 border-[#0101bf] rounded-lg items-center justify-center">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onLoadError}
        className="pdf-document"
        loading={<SpinnerCircular size={100} thickness={100} speed={200} color="black" still={false} secondaryColor='white' />}
      >
        <Page width={700} pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
      </Document>

      {/* Pagination Controls */}
      <div className="pagination flex flex-row p-6 justify-center space-x-8 ">
        <Button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className={`px-4 py-2 rounded-lg text-white bg-[#0101bf] border-2 border-[#0101bf] transition duration-200 ease-in-out ${pageNumber <= 1 ? '' : 'hover:bg-[#f3f2fe] hover:text-[#0101bf]'}`}
        >
          <ArrowBigLeft size={30} />
        </Button>
        <Button
          disabled={pageNumber >= (numPages)}
          onClick={() => setPageNumber(pageNumber + 1)}
          className={`px-4 py-2 rounded-lg text-white bg-[#0101bf] border-2 border-[#0101bf] transition duration-200 ease-in-out ${pageNumber >= (numPages) ? '' : 'hover:bg-[#f3f2fe] hover:text-[#0101bf]'}`}
        >
          <ArrowBigRight size={30} />
        </Button>
      </div>
    </div>
  );
};

export default PdfViewer;
