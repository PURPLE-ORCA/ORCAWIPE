import React from "react"
import { Github, Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t mt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground">Made by Purple Orca</p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/PURPLE-ORCA/ORCAWIPE.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
