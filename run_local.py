import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class LocalHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Disable caching for local development so edits appear immediately
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        # Ensure JavaScript modules and CSS serve with exact MIME types
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        return super().guess_type(path)

def run():
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), LocalHandler) as httpd:
            url = f"http://localhost:{PORT}"
            print("=" * 65)
            print("  Dentiva Dental Clinic Portal - Local Development Server")
            print("=" * 65)
            print(f"  Status:       RUNNING")
            print(f"  Local URL:    {url}")
            print(f"  Root Dir:     {DIRECTORY}")
            print("-" * 65)
            print("  Sandbox Demo Accounts for Testing:")
            print("    * Doctor:  doctor@dentiva.com  /  doctor123")
            print("    * Patient: subhajit@patient.com  /  patient123")
            print("    * Patient: mark@patient.com  /  patient123")
            print("    * Patient: souvik@patient.com  /  patient123")
            print("-" * 65)
            print("  Press Ctrl+C anytime to stop the server.")
            print("=" * 65)

            # Automatically launch the web browser
            webbrowser.open(url)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped gracefully.")
        sys.exit(0)
    except OSError as e:
        print(f"\n[Error] Port {PORT} is already in use. Please free port {PORT} or specify another.")
        sys.exit(1)

if __name__ == '__main__':
    run()
