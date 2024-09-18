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
  
  //Handle inner tien hang
  function loadTongTien() {
    const tongTienInfo = getTongTien();
    if (tongTienInfo != null) {
      document.getElementById("tien-hang").innerHTML = new Intl.NumberFormat().format(tongTienInfo.tongTienHang) + " đ";
      document.getElementById("giam-gia").innerHTML = new Intl.NumberFormat().format(tongTienInfo.tongGiamGia) + " đ";
      document.getElementById("total-amount").innerHTML = new Intl.NumberFormat().format(tongTienInfo.tongTienHang - tongTienInfo.tongGiamGia) + " đ";
    }
  }
  
  //Add every key - value whenever press ghi vao don
  function addSingleItem(productName, count, price, giamGia, thanhTien) {
    const tongTienInfo = {
      productName: productName,
      count: count,
      price: price,
      giamGia: giamGia,
      thanhTien: thanhTien
    }
    const tongTienJSON = JSON.stringify(tongTienInfo);
    localStorage.setItem(localStorage.length, tongTienJSON);
  }
  
  //Get chi tiet don hang
  
  function listChiTiet() {
    let order = 0;
    let constructHTML = "<tr><td>#</td><td>Sản phẩm</td><td>Số lượng</td><td>Đơn giá</td><td>Giảm giá</td><td>Thành tiền</td><td>Thao tác</td></tr>";
    for (let i = 1; i < localStorage.length; i++) {
      const tongTienInfo = localStorage.getItem(i);
      const tongTienInfoObj = JSON.parse(tongTienInfo);
      constructHTML += "<tr><td>" + ++order + "<input type=\"number\" class=\"key-index\" value=\"" + i + "\">" + "</td><td>" + tongTienInfoObj.productName + "</td><td>" + tongTienInfoObj.count + "</td><td>" + new Intl.NumberFormat().format(tongTienInfoObj.price) + " đ" + "</td><td>" + new Intl.NumberFormat().format(tongTienInfoObj.giamGia) + " đ" + "</td><td>" + new Intl.NumberFormat().format(tongTienInfoObj.thanhTien) + " đ" + "</td><td><button class=\"btn btn-danger btn-sm mb-2 xoa-single-item\">Xóa</button></td></tr>";
    }
  
    document.getElementById("list-sp").innerHTML = constructHTML;
  }
  
  // handle xoa single item
  function xoaSingleItem() {
    $("#list-sp").on('click', '.xoa-single-item', function () {
      var indexDeleted = parseInt($(this).closest('tr').find('.key-index').val());
      var dataDeleted = localStorage.getItem(indexDeleted);
      var objDeleted = JSON.parse(dataDeleted);
      var tienHang = objDeleted.price * objDeleted.count;
      var giamGia = objDeleted.giamGia;
      //Calculate tien hang again
      const xoaTongTien = getTongTien();
      const tongTienInfo = {
        tongTienHang: xoaTongTien.tongTienHang - tienHang,
        tongGiamGia: xoaTongTien.tongGiamGia - giamGia,
        orderID: xoaTongTien.orderID
      };
      const tongTienJSON = JSON.stringify(tongTienInfo);
      localStorage.setItem("tongTienInfo", tongTienJSON);
      // Bat dau lap tu index phia sau phan tu can xoa
      for (let i = parseInt(indexDeleted) + 1; i < localStorage.length; i++) {
        localStorage.setItem(i - 1, localStorage.getItem(i));
      }
      // Xoa item cuoi bi duplicate
      localStorage.removeItem(localStorage.length - 1);
      listChiTiet();
      loadTongTien();
      loadTongTienModalIsOpen();
      setTimeout(function () {
        if (localStorage.getItem('1') == null) { alert("Cần thêm ít nhất 1 sản phảm vào đơn hàng"); $('#donHangModal').modal('hide'); return; }
      }, 500);
    });
  }
  
  // Handle ghi don
  function handleGhiDon() {
    $('.ghi-don').click(function () {
      // Find the price element within the same product row
      var price = $(this).closest('.productItem').find('.price').val();
      var count = $(this).closest('.productItem').find('.soLuong').val();
      //reset soLuong
      $(this).closest('.productItem').find('.soLuong').val(1);
      var selectedColor = $(this).closest('.productItem').find('.mau-sac input[type="radio"]:checked').next('label').text();
      //reset color
      $(this).closest('.productItem').find('.mau-sac input[type="radio"]').prop('checked', false);
      var selectedSize = $(this).closest('.productItem').find('.kich-thuoc input[type="radio"]:checked').next('label').text();
      //reset kich thuoc
      $(this).closest('.productItem').find('.kich-thuoc input[type="radio"]').prop('checked', false);
      var giamGia = $(this).closest('.productItem').find('.giam-gia').val();
      //reset giamGia
      $(this).closest('.productItem').find('.giam-gia').val(0);
      // verify selected
      if (selectedColor == "" || selectedSize == "") { alert("Vui lòng chọn đầy đủ thuộc tính sản phẩm!"); return; }
      var productName = $(this).closest('.productItem').find('.product-name').text() + " - " + selectedColor + " - " + selectedSize;
      var tienGiamGia = price * count * giamGia / 100.0;
      var thanhTien = price * count - tienGiamGia;
  
      const tongTien = getTongTien();
  
      if (tongTien == null) {//Chua ghi gi vao localStorage
        const tongTienInfo = {
          tongTienHang: price * count,
          tongGiamGia: price * count * giamGia / 100.0,
          orderID: 1
        };
        const tongTienJSON = JSON.stringify(tongTienInfo);
        localStorage.setItem("tongTienInfo", tongTienJSON);
        loadOrderID();
      }
  
      else {
  
        const tongTienInfo = {
          tongTienHang: tongTien.tongTienHang + price * count,
          tongGiamGia: tongTien.tongGiamGia + price * count * giamGia / 100.0,
          orderID: tongTien.orderID
        };
        const tongTienJSON = JSON.stringify(tongTienInfo);
        localStorage.setItem("tongTienInfo", tongTienJSON);
      }
      // Alert the price
      //alert(getTongTien().tongTienHang + " " + getTongTien().tongGiamGia + " " + localStorage.length); for debug purpose
      loadTongTien();
      addSingleItem(productName, count, price, tienGiamGia, thanhTien);
      listChiTiet();
      $(this).closest('.productItem').find('.add-success').fadeIn('slow', function () {
        $(this).delay(1000).fadeOut('slow');
      });
    })
  }
  
  //Verify phuong thuc thanh toan
  
  function verifyPaymethod() {
    var paymentMethod = $('#pttt input[type="radio"]:checked').closest('.form-check').find('label img').attr('alt') || $('#pttt input[type="radio"]:checked').closest('.form-check').find('label').text().trim() || "not found";
    if (paymentMethod == "not found") {
      alert("Chọn phương thức thanh toán");
      $('#donHangModal').modal('hide');
      // Delay truoc khi scroll
      setTimeout(function () {
        $([document.documentElement, document.body]).animate({
          scrollTop: $("#pttt").offset().top
        }, 500); //smooth scrolling
      });
      return;
    } else {
      document.getElementById("modal-pttt").innerHTML = "<p>Thanh toán bằng " + paymentMethod + ",</p>";
    }
  }
  
  //Verify isPaid()
  function isPaid() {
    $('#donHangModal').on('shown.bs.modal', function () {
      if ($('#flexSwitchCheckDefault').is(':checked')) {
        document.getElementById("modal-tttt").innerHTML = "<strong>&nbsp;đã thanh toán</strong>";
      } else {
        document.getElementById("modal-tttt").innerHTML = "<strong>&nbsp;chưa thanh toán</strong>";
      }
    });
  }
  
  //Verify when open don hang
  
  function verifyModal() {
    $('#donHangModal').on('shown.bs.modal', function () {
      if (localStorage.getItem('1') == null) { alert("Cần thêm ít nhất 1 sản phảm vào đơn hàng"); $('#donHangModal').modal('hide'); return; }
      if (!$('#flexSwitchCheckChecked').is(':checked')) {
        var nguoiNhan = $('.giao-hang input[type="text"]').first().val();
        var soDienThoai = $('.giao-hang input[type="number"]').val();
        var diaChi = $('.giao-hang input[type="text"]').last().val();
        if (nguoiNhan == "" || soDienThoai == "" || diaChi == "") {
          alert("Bạn quên nhập đầy đủ thông tin giao hàng!");
          $('#donHangModal').modal('hide');
          // Delay truoc khi scroll
          setTimeout(function () {
            $([document.documentElement, document.body]).animate({
              scrollTop: $("#ttgh").offset().top
            }, 500); // smooth scrolling
          });
          return;
        }
        else {
  
          document.getElementById("modal-ttgh").innerHTML = "Thông tin giao hàng:<br>Gửi từ: ADAM STORE<br>Đến:<br>" + nguoiNhan + "<br>" + soDienThoai + "<br>" + diaChi;
  
        }
      }
      verifyPaymethod();
  
    });
    handlePrint();
  }
  
  //Handle modal tien hang
  function loadTongTienModal() {
    $('#donHangModal').on('shown.bs.modal', function () {
      const tongTienInfoModal = getTongTien();
      if (tongTienInfoModal != null) {
        document.getElementById("modal-tien-hang").innerHTML = new Intl.NumberFormat().format(tongTienInfoModal.tongTienHang) + " đ";
        document.getElementById("modal-giam-gia").innerHTML = new Intl.NumberFormat().format(tongTienInfoModal.tongGiamGia) + " đ";
        document.getElementById("modal-total-amount").innerHTML = new Intl.NumberFormat().format(tongTienInfoModal.tongTienHang - tongTienInfoModal.tongGiamGia) + " đ";
      }
    })
  }
  
  //Hndle loadTongTienModa when modal is open
  function loadTongTienModalIsOpen() {
    const tongTienInfoModal = getTongTien();
    if (tongTienInfoModal != null) {
      document.getElementById("modal-tien-hang").innerHTML = new Intl.NumberFormat().format(tongTienInfoModal.tongTienHang) + " đ";
      document.getElementById("modal-giam-gia").innerHTML = new Intl.NumberFormat().format(tongTienInfoModal.tongGiamGia) + " đ";
      document.getElementById("modal-total-amount").innerHTML = new Intl.NumberFormat().format(tongTienInfoModal.tongTienHang - tongTienInfoModal.tongGiamGia) + " đ";
    }
  }
  
  //Handle Order ID when printing
  function handleOrderID() {
    const initID = getTongTien();
    localStorage.clear();
    const insertNew = {
      tongTienHang: 0,
      tongGiamGia: 0,
      orderID: ++initID.orderID
    };
    const insertNewJSON = JSON.stringify(insertNew);
    localStorage.setItem("tongTienInfo", insertNewJSON);
  }
  
  //Load order id
  
  function loadOrderID() {
    const idDH = getTongTien();
    document.getElementById("donHangModalLabel").innerHTML = "Đơn hàng số #" + idDH.orderID;
  }
  
  //Print the modal
  function handlePrint() {
    $('.print-modal').click(function () {
      let printContents = $('#donHangModal').html();
      handleOrderID();
      listChiTiet();
      loadTongTien();
      loadTongTienModalIsOpen();
      loadOrderID();
      removeTTGHModal();
      $('#donHangModal').modal('hide');
      handleGHAfterPrint();
      let printWindow = window.open('', 'PrintWindow', 'height=800,width=1000');
      printWindow.document.write(`
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <title>Mini Web App - Ky nang nghe nghiep</title>
          <link rel="icon" href="img/mdb-favicon.ico" type="image/x-icon" />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.2/css/all.css" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" />
          <link rel="stylesheet" href="css/bootstrap-shopping-carts.min.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/7.3.2/mdb.min.css" />
          <link rel="stylesheet" href="css/custom.css" />
        </head>
        <body>
          ${printContents} 
  
          <script type="text/javascript" src="js/mdb.min.js"></script>
          <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/7.3.2/mdb.umd.min.js"></script>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
          <script src="https://fengyuanchen.github.io/datepicker/js/datepicker.js"></script>
          <script type="text/javascript" src="js/custom-jquery.js"></script>
        </body>
        </html>
      `);
  
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    });
  }
  
  //Handle Thong tin giao hang sau khi print
  function handleGHAfterPrint() {
    $('#ttgh input[type="text"]').first().val("");
    $('#ttgh input[type="phone-number"]').val("");
    $('#ttgh input[type="text"]').last().val("");
  }
  
  //Remove old thong tin giao hang sau khi in
  function removeTTGHModal() {
    document.getElementById("modal-ttgh").innerHTML = "";
  }
  
  $(document).ready(function () {
    // Call the function
    verifyModal();
    isPaid();
    handleGiaoHang();
    handleGhiDon();
    loadTongTien();
    listChiTiet();
    xoaSingleItem();
    loadTongTienModal();
    loadOrderID();
  });