# Rakt Sangam - Lightweight Local HTTP Server using .NET HttpListener
param([int]$Port = 8080)

$listener = New-Object System.Net.HttpListener
try {
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Prefixes.Add("http://127.0.0.1:$Port/")
    $listener.Start()
} catch {
    # Fallback to single prefix if dual prefix conflicts
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    try {
        $listener.Start()
    } catch {
        Write-Error "Failed to start listener on port ${Port}: $_"
        exit 1
    }
}

Write-Output "Rakt Sangam server running at http://localhost:$Port/ and http://127.0.0.1:$Port/"

$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = (Get-Location).Path }

try {
    while ($listener.IsListening) {
        $response = $null
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $rawUrl = $request.RawUrl.Split('?')[0]
            if ($rawUrl -eq "/" -or $rawUrl -eq "") {
                $rawUrl = "/index.html"
            }

            # Prevent directory traversal
            $normalizedSubPath = $rawUrl.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $localPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($baseDir, $normalizedSubPath))

            if ($localPath.StartsWith($baseDir, [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path $localPath -PathType Leaf)) {
                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".svg"  { "image/svg+xml" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".ico"  { "image/x-icon" }
                    default { "application/octet-stream" }
                }
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("File Not Found")
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
        } catch {
            Write-Verbose "Request processing notice: $_"
        } finally {
            if ($response) {
                try { $response.Close() } catch {}
            }
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}

