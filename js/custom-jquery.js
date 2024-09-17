/* Huy Van is the original author of this 
This is to handle the function effects in Mini App
*/

//Handle delete data
function deleteData() {
    if (confirm("Xóa toàn bộ dữ liệu về đơn hàng hiện tại và số đơn hàng?") == true) {
      localStorage.clear();
      location.reload();
    }
  }
  
  // Handle giao hang
  function handleGiaoHang() {
    $('#flexSwitchCheckChecked').change(function () {
      if ($(this).is(':checked')) {
        $('.giao-hang').slideUp('slow');
      } else {
        $('.giao-hang').slideDown('slow');
      }
    });
  }

  /* Get Tong tien hang
  Please remember that the index of object tong tien hang is always the first */

function getTongTien() {
    const tongTienInfo = localStorage.getItem('tongTienInfo');
    if (tongTienInfo == null) {
      return null;
    }
    else {
      return JSON.parse(tongTienInfo);
    }
  }