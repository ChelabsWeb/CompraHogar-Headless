Add-Type -AssemblyName System.Drawing

$src = "public/categories/_originals"
$dst = "public/categories"
$out = 560
$whiteTol = 195

function Get-BBox {
    param([System.Drawing.Bitmap]$bmp, [int]$tol)
    $w = $bmp.Width; $h = $bmp.Height
    $minX = $w; $minY = $h; $maxX = -1; $maxY = -1
    $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $stride = $data.Stride
    $bytes = New-Object byte[] ($stride * $h)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
    $bmp.UnlockBits($data) | Out-Null
    for ($y = 0; $y -lt $h; $y++) {
        $row = $y * $stride
        for ($x = 0; $x -lt $w; $x++) {
            $i = $row + $x * 3
            $b = $bytes[$i]; $g = $bytes[$i + 1]; $r = $bytes[$i + 2]
            if ($r -lt $tol -or $g -lt $tol -or $b -lt $tol) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    if ($maxX -lt 0) { return $null }
    return @{ X = $minX; Y = $minY; W = ($maxX - $minX + 1); H = ($maxY - $minY + 1) }
}

Get-ChildItem "$src/*.jpg" | ForEach-Object {
    $name = $_.Name
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    $bmp = New-Object System.Drawing.Bitmap $img
    $img.Dispose()

    $bb = Get-BBox -bmp $bmp -tol $whiteTol
    if ($null -eq $bb) {
        Write-Output "$name -> SKIP (all white)"
        $bmp.Dispose()
        return
    }

    # Scale so the subject's longest side fills the output frame.
    $longest = [Math]::Max($bb.W, $bb.H)
    $factor = $out / $longest
    $newW = [int]($bb.W * $factor)
    $newH = [int]($bb.H * $factor)
    $offX = [int](($out - $newW) / 2)
    $offY = [int](($out - $newH) / 2)

    $final = New-Object System.Drawing.Bitmap $out, $out
    $gf = [System.Drawing.Graphics]::FromImage($final)
    $gf.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gf.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gf.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gf.Clear([System.Drawing.Color]::White)

    $srcRect = New-Object System.Drawing.Rectangle $bb.X, $bb.Y, $bb.W, $bb.H
    $dstRect = New-Object System.Drawing.Rectangle $offX, $offY, $newW, $newH
    $gf.DrawImage($bmp, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $gf.Dispose()
    $bmp.Dispose()

    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $params = New-Object System.Drawing.Imaging.EncoderParameters 1
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
    $outPath = Join-Path $dst $name
    $final.Save($outPath, $encoder, $params)
    $final.Dispose()
    Write-Output ("{0,-22} bbox {1}x{2} -> {3}x{4} centered at ({5},{6})" -f $name, $bb.W, $bb.H, $newW, $newH, $offX, $offY)
}
