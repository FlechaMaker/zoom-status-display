-- Originally by tyhawkins
-- https://gist.github.com/tyhawkins/66d6f6ca8b3cb30c268df76d83020a64

property audioBtnTitleJa : "オーディオのミュート"
property videoBtnTitleJa : "ビデオの停止"
property menuTitleJa : "ミーティング"

property audioBtnTitleEn : "Mute audio"
property videoBtnTitleEn : "Stop video"
property menuTitleEn : "Meeting"

if application "zoom.us" is running then
	tell application "System Events"
		tell application process "zoom.us"
			if exists (menu item audioBtnTitleJa of menu 1 of menu bar item menuTitleJa of menu bar 1) then
				set audioStatus to "Unmuted"
			else if exists (menu item audioBtnTitleEn of menu 1 of menu bar item menuTitleEn of menu bar 1) then
				set audioStatus to "Unmuted"
			else
				set audioStatus to "Muted"
			end if

			if exists (menu item videoBtnTitleJa of menu 1 of menu bar item menuTitleJa of menu bar 1) then
				set videoStatus to "Unmuted"
			else if exists (menu item videoBtnTitleEn of menu 1 of menu bar item menuTitleEn of menu bar 1) then
				set videoStatus to "Unmuted"
			else
				set videoStatus to "Muted"
			end if
		end tell
	end tell
else
	set audioStatus to ""
	set videoStatus to ""
end if

return "{ \"audio\": \"" & audioStatus & "\", \"video\": \"" & videoStatus & "\" }"