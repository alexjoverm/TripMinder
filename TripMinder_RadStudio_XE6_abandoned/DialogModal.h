//---------------------------------------------------------------------------

#ifndef DialogModalH
#define DialogModalH
//---------------------------------------------------------------------------
#include <System.Classes.hpp>
#include <FMX.Controls.hpp>
#include <FMX.Forms.hpp>
#include <FMX.StdCtrls.hpp>
#include <FMX.Types.hpp>
#include <FMX.Layouts.hpp>
//---------------------------------------------------------------------------
class TFormDialogModal : public TForm
{
__published:	// IDE-managed Components
	TAniIndicator *AniIndicator1;
	TLabel *Label1;
	TLayout *Layout1;
private:	// User declarations
public:		// User declarations
	__fastcall TFormDialogModal(TComponent* Owner);
};
//---------------------------------------------------------------------------
extern PACKAGE TFormDialogModal *FormDialogModal;
//---------------------------------------------------------------------------
#endif
