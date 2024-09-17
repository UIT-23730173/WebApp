/* Huy Van is the original author of this 
This is to handle the function effects in Mini App
*/function deleteData() {
  if (confirm("Xóa toàn bộ dữ liệu về đơn hàng hiện tại và số đơn hàng?") == false) {
    localStorage.clear();
    location.reload();
  }
}