'use client'

import { useState } from 'react'
import { FileText, Upload, Download, Trash2 } from 'lucide-react'

export default function ProjectDocumentsPage({ params }: { params: { id: string } }) {
  const [documents] = useState([
    {
      id: '1',
      name: 'Project Requirements.pdf',
      size: '2.4 MB',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-15'
    },
    {
      id: '2', 
      name: 'Design Mockups.zip',
      size: '15.7 MB',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2024-01-14'
    }
  ])

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Documents</h1>
          <p className="text-gray-600 mt-1">Manage project files and resources</p>
        </div>
        <button className="btn btn-primary flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Project Files</h2>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No documents uploaded yet</p>
            <button className="btn btn-primary">
              Upload your first document
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">
                      {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
