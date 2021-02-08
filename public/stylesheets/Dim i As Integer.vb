Dim i As Integer
Dim x As Range
Dim radioAct As New RadioAction
Dim Form_Action As New FormAction


Private Sub OptionButton43_Click()
radioAct.RadioButtonClick Sheet1, "K44", 6#
End Sub

Private Sub OptionButton44_Click()
radioAct.RadioButtonClick Sheet1, "K44", 0#
End Sub

Private Sub OptionButton45_Click()
radioAct.RadioButtonClick Sheet1, "K49", 5#
End Sub

Private Sub OptionButton46_Click()
radioAct.RadioButtonClick Sheet1, "K49", 0#
End Sub

Private Sub OptionButton47_Click()
radioAct.RadioButtonClick Sheet1, "K51", 5#
End Sub

Private Sub OptionButton48_Click()
radioAct.RadioButtonClick Sheet1, "K51", 0#
End Sub

Private Sub OptionButton49_Click()
radioAct.RadioButtonClick Sheet1, "K52", 5#
End Sub

Private Sub OptionButton50_Click()
radioAct.RadioButtonClick Sheet1, "K52", 0#
End Sub

Private Sub OptionButton53_Click()
radioAct.RadioButtonClick Sheet1, "K63", 2.5
End Sub

Private Sub OptionButton54_Click()
radioAct.RadioButtonClick Sheet1, "K63", 0#
End Sub

Private Sub Worksheet_Change(ByVal Target As Range)

If Not Intersect(Target, Sheet1.Range("D11")) Is Nothing Then
    Select Case Sheet1.Range("D11").Value
        Case "Call / Ticket"
            Rows("22:24").Hidden = False
            Rows("30:33").Hidden = False
            Rows("45:47").Hidden = False
            Rows("54:57").Hidden = False
            Rows("19:21").Hidden = False
            Rows("25:29").Hidden = False
            Rows("34:44").Hidden = False
            Rows("48:53").Hidden = False
            Rows("58:60").Hidden = False
        Case "Call"
            Rows("22:24").Hidden = True
            Rows("30:33").Hidden = True
            Rows("45:47").Hidden = True
            Rows("54:57").Hidden = True
            Rows("19:21").Hidden = False
            Rows("25:29").Hidden = False
            Rows("34:44").Hidden = False
            Rows("48:53").Hidden = False
            Rows("58:60").Hidden = False
        Case "Ticket"
            Rows("22:24").Hidden = False
            Rows("30:33").Hidden = False
            Rows("45:47").Hidden = False
            Rows("54:57").Hidden = False
            Rows("19:21").Hidden = True
            Rows("25:29").Hidden = True
            Rows("34:44").Hidden = True
            Rows("48:53").Hidden = True
            Rows("58:60").Hidden = True
    End Select

End If

End Sub

Private Sub cmdclear_Click()
    For i = 1 To ActiveSheet.OLEObjects.Count
        If TypeName(ActiveSheet.OLEObjects(i).Object) = "OptionButton" Then
            ActiveSheet.OLEObjects(i).Object = False
            
        End If
    Next i

    Range("K19:L60").ClearContents
    Range("D7:G10").ClearContents
    Range("J7:L9").ClearContents
    Range("D11").Value = "Call / Ticket"
End Sub

Private Sub cmdsave_Click()

    Form_Action.SaveEmail

End Sub

Private Sub OptionButton1_Click()
'Range("L19").Value = 5
radioAct.RadioButtonClick Sheet1, "K20", 5#


End Sub

Private Sub OptionButton10_Click()
'Range("L27").Value = 0
radioAct.RadioButtonClick Sheet1, "K28", 0#
End Sub

Private Sub OptionButton11_Click()
'Range("L30").Value = 30
radioAct.RadioButtonClick Sheet1, "K29", 5#
End Sub

Private Sub OptionButton12_Click()
'Range("L30").Value = 0
radioAct.RadioButtonClick Sheet1, "K29", 0#
End Sub

Private Sub OptionButton13_Click()
'Range("L34").Value = 10
radioAct.RadioButtonClick Sheet1, "K35", 5#
End Sub

Private Sub OptionButton14_Click()
'Range("L34").Value = 0
radioAct.RadioButtonClick Sheet1, "K35", 0#
End Sub

Private Sub OptionButton15_Click()
'Range("L38").Value = 5
radioAct.RadioButtonClick Sheet1, "K36", 4#
End Sub

Private Sub OptionButton16_Click()
'Range("L38").Value = 0
radioAct.RadioButtonClick Sheet1, "K36", 0#
End Sub

Private Sub OptionButton17_Click()
'Range("L39").Value = 5
radioAct.RadioButtonClick Sheet1, "K37", 3#
End Sub

Private Sub OptionButton18_Click()
radioAct.RadioButtonClick Sheet1, "K37", 0#
End Sub

Private Sub OptionButton19_Click()
'Range("L42").Value = 5
radioAct.RadioButtonClick Sheet1, "K38", 5#
End Sub

Private Sub OptionButton2_Click()
'Range("L19").Value = 0
radioAct.RadioButtonClick Sheet1, "K20", 0#
End Sub

Private Sub OptionButton20_Click()
'Range("L42").Value = 0
radioAct.RadioButtonClick Sheet1, "K38", 0#
End Sub

Private Sub OptionButton21_Click()
radioAct.RadioButtonClick Sheet1, "K39", 5#
End Sub

Private Sub OptionButton22_Click()
radioAct.RadioButtonClick Sheet1, "K39", 0#
End Sub

Private Sub OptionButton23_Click()
radioAct.RadioButtonClick Sheet1, "K40", 6#
End Sub

Private Sub OptionButton24_Click()
radioAct.RadioButtonClick Sheet1, "K40", 0#
End Sub

Private Sub OptionButton25_Click()
radioAct.RadioButtonClick Sheet1, "K41", 5#
End Sub

Private Sub OptionButton26_Click()
radioAct.RadioButtonClick Sheet1, "K41", 0#
End Sub

Private Sub OptionButton27_Click()
radioAct.RadioButtonClick Sheet1, "K42", 6#
End Sub

Private Sub OptionButton28_Click()
radioAct.RadioButtonClick Sheet1, "K42", 0#
End Sub

Private Sub OptionButton29_Click()
radioAct.RadioButtonClick Sheet1, "K43", 6#
End Sub

Private Sub OptionButton3_Click()
'Range("L21").Value = 5
radioAct.RadioButtonClick Sheet1, "K21", 5#
End Sub

Private Sub OptionButton30_Click()
radioAct.RadioButtonClick Sheet1, "K43", 0#
End Sub

Private Sub OptionButton31_Click()
radioAct.RadioButtonClick Sheet1, "K48", 5#
End Sub

Private Sub OptionButton32_Click()
radioAct.RadioButtonClick Sheet1, "K48", 0#
End Sub

Private Sub OptionButton33_Click()
radioAct.RadioButtonClick Sheet1, "K61", 2.5
End Sub

Private Sub OptionButton34_Click()
radioAct.RadioButtonClick Sheet1, "K61", 0#
End Sub

Private Sub OptionButton35_Click()
Range("L58").Value = 10
End Sub

Private Sub OptionButton36_Click()
Range("L58").Value = 0
End Sub

Private Sub OptionButton37_Click()
Range("L25").Value = 5
End Sub

Private Sub OptionButton38_Click()
Range("L27").Value = 10
End Sub

Private Sub OptionButton39_Click()
Range("L30").Value = 15
End Sub

Private Sub OptionButton4_Click()
'Range("L21").Value = 0
radioAct.RadioButtonClick Sheet1, "K21", 0#
End Sub

Private Sub OptionButton40_Click()
Range("L34").Value = 5
End Sub

Private Sub OptionButton41_Click()
Range("L38").Value = 2.5
End Sub

Private Sub OptionButton42_Click()
Range("L45").Value = 2.5
End Sub

Private Sub OptionButton5_Click()
'Range("L22").Value = 15
radioAct.RadioButtonClick Sheet1, "K25", 4#
End Sub

Private Sub OptionButton6_Click()
'Range("L22").Value = 0
radioAct.RadioButtonClick Sheet1, "K25", 0#
End Sub

Private Sub OptionButton7_Click()
'Range("L25").Value = 10
radioAct.RadioButtonClick Sheet1, "K27", 4#
End Sub

Private Sub OptionButton8_Click()
'Range("L25").Value = 0
radioAct.RadioButtonClick Sheet1, "K27", 0#
End Sub

Private Sub OptionButton9_Click()
'Range("L27").Value = 20
radioAct.RadioButtonClick Sheet1, "K28", 3#
End Sub
