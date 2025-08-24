'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'

export default function TestPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Light Mode Test Page
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Theme Display */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Current Theme</h2>
              <p className="text-gray-600 mb-4">
                Current theme: <span className="font-medium text-primary-600">Light</span>
              </p>
              <p className="text-sm text-gray-500">
                Dark mode has been removed from this application.
              </p>
            </div>

            {/* Color Palette Test */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span className="text-sm">Background</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span className="text-sm">Secondary Background</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-primary-600 rounded"></div>
                  <span className="text-sm">Primary Color</span>
                </div>
              </div>
            </div>

            {/* Text Colors Test */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Text Colors</h2>
              <div className="space-y-2">
                            <p className="text-gray-900">Primary Text</p>
            <p className="text-gray-700">Secondary Text</p>
            <p className="text-gray-500">Muted Text</p>
            <p className="text-primary-600">Link Text</p>
              </div>
            </div>

            {/* Form Elements Test */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Form Elements</h2>
              <div className="space-y-4">
                <label htmlFor="test-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Input
                </label>
                <input
                  type="text"
                  id="test-input"
                  name="test-input"
                  placeholder="Input field"
                  className="input"
                />
                <label htmlFor="test-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Select
                </label>
                <select id="test-select" name="test-select" className="input">
                  <option>Select option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <button className="btn btn-primary">Primary Button</button>
                <button className="btn btn-secondary">Secondary Button</button>
              </div>
            </div>
          </div>

          {/* Priority Badges Test */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Priority Badges
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="priority-badge priority-low">Low</span>
              <span className="priority-badge priority-medium">Medium</span>
              <span className="priority-badge priority-high">High</span>
              <span className="priority-badge priority-urgent">Urgent</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
