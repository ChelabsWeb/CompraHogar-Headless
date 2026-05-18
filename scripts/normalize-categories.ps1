Add-Type -AssemblyName System.Drawing

# Normalize category thumbnails: detect subject bbox, then place each subject
# centered in a 560x560 white canvas occupying $fillRatio of the frame.
# For very elongated subjects (e.g. pendant lamp with long cable), the bbox is
# refined to the "dense region" so the visually important part dominates.

$src = "public/categories/_originals"
$dst = "public/categories"
$out = 560
$fillRatio = 0.82
$whiteTol = 215
$elongationThreshold = 1.6   # if H/W or W/H exceeds this, refine bbox to dense region
$denseRatio = 0.4            # rows/cols with >= this fraction of bbox span are "dense"

# Manual bbox overrides for images where automatic detection fails (e.g. subjects
# with transparent/reflective parts that the white-tolerance check skips). Empty
# by default; populate with @{ "filename.jpg" = @{ X = ...; Y = ...; W = ...; H = ... } }
# if a specific image needs a forced bbox after visual review.
$manualBBox = @{}

function Get-Bytes {
    param([System.Drawing.Bitmap]$bmp)
    $w = $bmp.Width; $h = $bmp.Height
    $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $stride = $data.Stride
    $bytes = New-Object byte[] ($stride * $h)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
    $bmp.UnlockBits($data) | Out-Null
    return @{ Bytes = $bytes; Stride = $stride; W = $w; H = $h }
}

function Is-Subject {
    param($pix, [int]$x, [int]$y, [int]$tol)
    $i = $y * $pix.Stride + $x * 3
    $b = $pix.Bytes[$i]; $g = $pix.Bytes[$i + 1]; $r = $pix.Bytes[$i + 2]
    return ($r -lt $tol -or $g -lt $tol -or $b -lt $tol)
}

function Get-BBox {
    param($pix, [int]$tol)
    $w = $pix.W; $h = $pix.H
    $minX = $w; $minY = $h; $maxX = -1; $maxY = -1
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            if (Is-Subject $pix $x $y $tol) {
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

function Refine-DenseRegion {
    param($pix, $bb, [int]$tol, [double]$threshold)
    # Refine only along the elongated axis: a tall/thin subject (H > W) gets its
    # Y range trimmed to rows where horizontal density >= threshold * bb.W (this
    # discards thin appendages like cables). A wide/short subject does the symmetric
    # thing on the X axis. The other axis is left untouched so we don't accidentally
    # crop a wide product.
    $bxEnd = $bb.X + $bb.W
    $byEnd = $bb.Y + $bb.H

    if ($bb.H -gt $bb.W) {
        $rowMin = [int]($bb.W * $threshold)
        $newMinY = -1; $newMaxY = -1
        for ($y = 0; $y -lt $bb.H; $y++) {
            $c = 0
            for ($x = $bb.X; $x -lt $bxEnd; $x++) {
                if (Is-Subject $pix $x ($bb.Y + $y) $tol) { $c++ }
            }
            if ($c -ge $rowMin) {
                if ($newMinY -lt 0) { $newMinY = $y }
                $newMaxY = $y
            }
        }
        if ($newMinY -lt 0) { return $bb }
        return @{ X = $bb.X; Y = $bb.Y + $newMinY; W = $bb.W; H = ($newMaxY - $newMinY + 1) }
    } else {
        $colMin = [int]($bb.H * $threshold)
        $newMinX = -1; $newMaxX = -1
        for ($x = 0; $x -lt $bb.W; $x++) {
            $c = 0
            for ($y = $bb.Y; $y -lt $byEnd; $y++) {
                if (Is-Subject $pix ($bb.X + $x) $y $tol) { $c++ }
            }
            if ($c -ge $colMin) {
                if ($newMinX -lt 0) { $newMinX = $x }
                $newMaxX = $x
            }
        }
        if ($newMinX -lt 0) { return $bb }
        return @{ X = $bb.X + $newMinX; Y = $bb.Y; W = ($newMaxX - $newMinX + 1); H = $bb.H }
    }
}

Get-ChildItem "$src/*.jpg" | ForEach-Object {
    $name = $_.Name
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    $bmp = New-Object System.Drawing.Bitmap $img
    $img.Dispose()
    $pix = Get-Bytes $bmp

    $refined = $false
    $manual = $false
    if ($manualBBox.ContainsKey($name)) {
        $bb = $manualBBox[$name]
        $manual = $true
    } else {
        $bb = Get-BBox -pix $pix -tol $whiteTol
        if ($null -eq $bb) {
            Write-Output "$name -> SKIP (all white)"
            $bmp.Dispose()
            return
        }
        $aspect = [Math]::Max($bb.W / $bb.H, $bb.H / $bb.W)
        if ($aspect -gt $elongationThreshold) {
            $bb = Refine-DenseRegion -pix $pix -bb $bb -tol $whiteTol -threshold $denseRatio
            $refined = $true
        }
    }

    $longest = [Math]::Max($bb.W, $bb.H)
    $targetLongest = $out * $fillRatio
    $factor = $targetLongest / $longest
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
    $tag = if ($manual) { "[manual]" } elseif ($refined) { "[refined]" } else { "" }
    Write-Output ("{0,-22} bbox {1,3}x{2,-3} -> {3,3}x{4,-3} at ({5,3},{6,-3}) {7}" -f $name, $bb.W, $bb.H, $newW, $newH, $offX, $offY, $tag)
}
