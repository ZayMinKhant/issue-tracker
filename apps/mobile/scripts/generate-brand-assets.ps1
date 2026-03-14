Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

function New-RoundedRectanglePath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-BrandMasterBitmap {
  param([int]$Size = 1024)

  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#F9FBFE'))

  $backgroundGlowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(26, 212, 229, 255))
  $graphics.FillEllipse($backgroundGlowBrush, 112, 112, 800, 800)
  $backgroundGlowBrush.Dispose()

  $documentShadowPath = New-RoundedRectanglePath 230 218 508 562 84
  $documentShadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(28, 25, 50, 90))
  $graphics.FillPath($documentShadowBrush, $documentShadowPath)

  $documentPath = New-RoundedRectanglePath 214 202 508 562 84
  $documentBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    [System.Drawing.PointF]::new(214, 202),
    [System.Drawing.PointF]::new(722, 764),
    [System.Drawing.ColorTranslator]::FromHtml('#FFFFFF'),
    [System.Drawing.ColorTranslator]::FromHtml('#CFE3F5')
  )
  $graphics.FillPath($documentBrush, $documentPath)

  $overlayBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(62, 130, 180, 220))
  $overlayPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(250, 700),
    [System.Drawing.PointF]::new(690, 438),
    [System.Drawing.PointF]::new(690, 740),
    [System.Drawing.PointF]::new(250, 740)
  )
  $graphics.FillPolygon($overlayBrush, $overlayPoints)

  $documentStroke = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml('#1C2950'), 22)
  $documentStroke.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $graphics.DrawPath($documentStroke, $documentPath)

  $bulletBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#A4C7E4'))
  $linePenWide = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml('#BED8EA'), 30)
  $linePenWide.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $linePenWide.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $linePenSmall = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml('#BED8EA'), 24)
  $linePenSmall.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $linePenSmall.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.FillEllipse($bulletBrush, 300, 292, 36, 36)
  $graphics.FillEllipse($bulletBrush, 300, 375, 36, 36)
  $graphics.DrawLine($linePenWide, 370, 310, 525, 310)
  $graphics.DrawLine($linePenWide, 370, 393, 495, 393)
  $graphics.DrawLine($linePenSmall, 370, 474, 460, 474)

  $pinGlowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(85, 255, 219, 74))
  $graphics.FillEllipse($pinGlowBrush, 612, 128, 280, 280)

  $pinStemBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#1C2950'))
  $graphics.FillRectangle($pinStemBrush, 702, 302, 18, 118)
  $pinBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    [System.Drawing.PointF]::new(660, 190),
    [System.Drawing.PointF]::new(790, 312),
    [System.Drawing.ColorTranslator]::FromHtml('#FFE56E'),
    [System.Drawing.ColorTranslator]::FromHtml('#FF8C35')
  )
  $pinPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml('#272D4A'), 16)
  $graphics.FillEllipse($pinBrush, 650, 165, 118, 118)
  $graphics.DrawEllipse($pinPen, 650, 165, 118, 118)

  $checkShadowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(85, 8, 95, 77), 120)
  $checkShadowPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $checkShadowPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $checkShadowPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $checkShadowPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(470, 602),
    [System.Drawing.PointF]::new(575, 704),
    [System.Drawing.PointF]::new(808, 448)
  )
  $graphics.DrawLines($checkShadowPen, $checkShadowPoints)

  $checkOutlinePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 255, 248), 166)
  $checkOutlinePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $checkOutlinePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $checkOutlinePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $checkPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(452, 585),
    [System.Drawing.PointF]::new(567, 688),
    [System.Drawing.PointF]::new(825, 410)
  )
  $graphics.DrawLines($checkOutlinePen, $checkPoints)

  $checkBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    [System.Drawing.PointF]::new(430, 520),
    [System.Drawing.PointF]::new(830, 720),
    [System.Drawing.ColorTranslator]::FromHtml('#77F14E'),
    [System.Drawing.ColorTranslator]::FromHtml('#12A67A')
  )
  $checkPen = New-Object System.Drawing.Pen ($checkBrush, 102)
  $checkPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $checkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $checkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLines($checkPen, $checkPoints)

  $checkHighlightPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(150, 180, 255, 130), 34)
  $checkHighlightPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $checkHighlightPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $checkHighlightPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $highlightPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(464, 570),
    [System.Drawing.PointF]::new(570, 650),
    [System.Drawing.PointF]::new(790, 430)
  )
  $graphics.DrawLines($checkHighlightPen, $highlightPoints)

  $documentShadowPath.Dispose()
  $documentShadowBrush.Dispose()
  $documentPath.Dispose()
  $documentBrush.Dispose()
  $overlayBrush.Dispose()
  $documentStroke.Dispose()
  $bulletBrush.Dispose()
  $linePenWide.Dispose()
  $linePenSmall.Dispose()
  $pinGlowBrush.Dispose()
  $pinStemBrush.Dispose()
  $pinBrush.Dispose()
  $pinPen.Dispose()
  $checkShadowPen.Dispose()
  $checkOutlinePen.Dispose()
  $checkBrush.Dispose()
  $checkPen.Dispose()
  $checkHighlightPen.Dispose()
  $graphics.Dispose()

  return $bitmap
}

function Save-ScaledPng {
  param(
    [System.Drawing.Bitmap]$Source,
    [int]$Size,
    [string]$Path
  )

  $directory = Split-Path -Parent $Path
  if (-not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory | Out-Null
  }

  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.DrawImage($Source, 0, 0, $Size, $Size)
  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$master = New-BrandMasterBitmap

$androidIcons = @{
  'android/app/src/main/res/mipmap-mdpi/ic_launcher.png' = 48
  'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png' = 48
  'android/app/src/main/res/mipmap-hdpi/ic_launcher.png' = 72
  'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png' = 72
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png' = 96
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png' = 96
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png' = 144
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png' = 144
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png' = 192
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png' = 192
  'android/app/src/main/res/drawable-nodpi/splash_logo.png' = 360
  'src/assets/branding/viatick-icon.png' = 512
  'ios/mobile/Images.xcassets/AppIcon.appiconset/app-icon-20@2x.png' = 40
  'ios/mobile/Images.xcassets/AppIcon.appiconset/app-icon-20@3x.png' = 60
  'ios/mobile/Images.xcassets/AppIcon.appiconset/app-icon-29@2x.png' = 58
  'ios/mobile/Images.xcassets/AppIcon.appiconset/app-icon-29@3x.png' = 87
  'ios/mobile/Images.xcassets/AppIcon.appiconset/app-icon-40@2x.png' = 80
  'ios/mobile/Images.xcassets/AppIcon.appiconset/app-icon-40@3x.png' = 120
  'ios/mobile/Images.xcassets/AppIcon.appiconset/app-icon-60@2x.png' = 120
  'ios/mobile/Images.xcassets/AppIcon.appiconset/app-icon-60@3x.png' = 180
  'ios/mobile/Images.xcassets/AppIcon.appiconset/app-icon-1024.png' = 1024
  'ios/mobile/Images.xcassets/LaunchLogo.imageset/launch-logo.png' = 220
  'ios/mobile/Images.xcassets/LaunchLogo.imageset/launch-logo@2x.png' = 440
  'ios/mobile/Images.xcassets/LaunchLogo.imageset/launch-logo@3x.png' = 660
}

foreach ($item in $androidIcons.GetEnumerator()) {
  Save-ScaledPng -Source $master -Size $item.Value -Path (Join-Path $projectRoot $item.Key)
}

$master.Dispose()
