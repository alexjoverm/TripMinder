//---------------------------------------------------------------------------

#ifndef MainFormH
#define MainFormH
//---------------------------------------------------------------------------
#include <System.Classes.hpp>
#include <FMX.Controls.hpp>
#include <FMX.Forms.hpp>
#include <FMX.TabControl.hpp>
#include <FMX.Types.hpp>
#include <FMX.StdCtrls.hpp>
#include <FMX.ActnList.hpp>
#include <System.Actions.hpp>
//---------------------------------------------------------------------------
class TMainForm : public TForm
{
__published:	// IDE-managed Components
	TTabControl *TabControl1;
	TToolBar *BottomToolBar;
	TActionList *ActionList1;
	TTabItem *TabItem1;
	TTabItem *TabItem2;
	TToolBar *TopToolBar;
	TLabel *ToolBarLabel;
	TToolBar *TopToolBar1;
	TSpeedButton *btnBack;
	TLabel *ToolBarLabel1;
	TChangeTabAction *ChangeTabAction1;
	TChangeTabAction *ChangeTabAction2;
	TSpeedButton *SpeedButton1;
	void __fastcall FormCreate(TObject *Sender);
	void __fastcall FormKeyUp(TObject *Sender, WORD &Key, System::WideChar &KeyChar,
		  TShiftState Shift);

private:	// User declarations
public:		// User declarations
	__fastcall TMainForm(TComponent* Owner);
};
//---------------------------------------------------------------------------
extern PACKAGE TMainForm *MainForm;
//---------------------------------------------------------------------------
#endif
