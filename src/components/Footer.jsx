import React from 'react'

function Footer() {
    
  const footerItems = [
    "About",
    "Download the X app",
    "Grok",
    "Help Center",
    "Terms of Service",
    "Privacy Policy",
    "Cookie Policy",
    "Accessibility",
    "Ads info",
    "Blog",
    "Careers",
    "Brand Resources",
    "Advertising",
    "Marketing",
    "X for Business",
    "Developers",
    "Settings",
  ];

  return (
    <footer className="flex flex-wrap justify-center gap-1 absolute text-xs text-gray-500 mb-2 bottom-0 w-full">
      {footerItems.map((item, index) => (
        <React.Fragment key={index}>
          <span className="cursor-pointer hover:underline">{item}</span>
          {index !== footerItems.length - 1 && <span>|</span>}
        </React.Fragment>
      ))}
      <div className="w-full text-center mt-2 text-gray-500">
        © 2025 XBlog, Inc. All rights reserved.
      </div>
    </footer>
  )
}
export default Footer
