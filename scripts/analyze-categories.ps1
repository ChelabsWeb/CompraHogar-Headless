Add-Type -AssemblyName System.Drawing

$src = "public/categories/_originals"
$whiteTol = 235

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
    $W = $bmp.Width; $H = $bmp.Height
    $bb = Get-BBox -bmp $bmp -tol $whiteTol
    $bmp.Dispose()
    if ($null -eq $bb) { Write-Output "$name -> all white"; return }
    $cx = $bb.X + $bb.W / 2
    $cy = $bb.Y + $bb.H / 2
    $offX = $cx - $W/2
    $offY = $cy - $H/2
    $padL = $bb.X
    $padR = $W - ($bb.X + $bb.W)
    $padT = $bb.Y
    $padB = $H - ($bb.Y + $bb.H)
    $aspect = [Math]::Round($bb.W / $bb.H, 2)
    Write-Output ("{0,-22} bbox {1,3}x{2,-3} at ({3,3},{4,-3})  pads L={5,-3} R={6,-3} T={7,-3} B={8,-3}  aspect={9}  off=({10:N0},{11:N0})" -f $name, $bb.W, $bb.H, $bb.X, $bb.Y, $padL, $padR, $padT, $padB, $aspect, $offX, $offY)
}
