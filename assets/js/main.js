

/**----- SET DATA INTO LOCAL STORAGE -----**/
localStorage.setItem('frontEndTechnical', JSON.stringify(productData)); 





/**----- RETRIEVED DATA FROM LOCAL STORAGE -----**/
let retrievedData = localStorage.getItem('frontEndTechnical');





/**----- PRODUCTS SHOW INTO TABLE -----**/
products(JSON.parse(retrievedData))
document.querySelector('#btnBook').setAttribute('data-products', retrievedData);
document.querySelector('#btnReturn').setAttribute('data-products', retrievedData);




/**----- PRODUCTS METHOD -----**/
function products(data)
{
    let table = document.getElementById('productData');

    for(let i = 0; i < data.length; i++) {
        let row = ` <tr>
                        <td>${i+1}</td>
                        <td>${data[i].name}</td>
                        <td>${data[i].code}</td>
                        <td>${data[i].availability}</td>
                        <td>${data[i].needing_repair}</td>
                        <td>${data[i].durability}</td>
                        <td>${data[i].mileage}</td>
                    </tr> `

        table.innerHTML += row;
    }
}       





/**----- SEARCH PRODUCT METHOD -----**/
function searchProduct() {

    // DECLARE SEARCH STRING //
    var filter = searchBox.value.toUpperCase();

    // LOOP THROUGH FIRST TBODY'S ROWS //
    for (var rowI = 0; rowI < trs.length; rowI++) {

        // DEFINE THE ROW'S CELLS //
        var tds = trs[rowI].getElementsByTagName("td");

        // HIDE THE ROW //
        trs[rowI].style.display = "none";

        // LOOP THROUGH ROW CELLS //
        for (var cellI = 0; cellI < tds.length; cellI++) {

            // IF THERE'S A MATCH //
            if (tds[cellI].innerHTML.toUpperCase().indexOf(filter) > -1) {

                // SHOW THE ROW //
                trs[rowI].style.display = "";

                // SKIP TO THE NEXT ROW //
                continue;

            }
        }
    }
}





/**----- DECLARE ELEMENTS -----**/
const searchBox = document.getElementById('search');
const table = document.getElementById("productTable");
const trs = table.tBodies[0].getElementsByTagName("tr");

searchBox.addEventListener('keyup', searchProduct);





/**----- SHOWING PRODUCTS INTO PRODUCT BOOK MODAL -----**/
$('#productBookOrReturn').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget)
    let getProducts = button.data('products');
    let getDataType = button.data('type');

    $('#dataType').val(getDataType);

    if (getDataType == 'Return') {
        $('#productBookOrReturnLabel').html('<i class="bi bi-arrow-return-right"></i>  Return a Product')
    }

    let products = document.getElementById('products');

    for (var i = 0; i < getProducts.length; i++) {
        products.innerHTML = products.innerHTML + '<option value="' + getProducts[i].name + '" data-price="'+ getProducts[i].price +'" data-mileage="'+ getProducts[i].mileage +'" data-rental-period="'+ getProducts[i].minimum_rent_period +'">' + getProducts[i].name + ' / ' + getProducts[i].code + '</option>'
    }
})


function getProductInfo(obj)
{
    let productName = obj.options[obj.selectedIndex].value;
    let productPrice = obj.options[obj.selectedIndex].getAttribute('data-price');
    let productMileage = obj.options[obj.selectedIndex].getAttribute('data-mileage');

    document.getElementById('selectedProductName').value=productName;
    document.getElementById('selectedProductPrice').value=productPrice;
    document.getElementById('selectedProductMileage').value='Mileage: '+productMileage
}


function productBookOrReturn()
{
    let fromDate = new Date(document.getElementById('fromDate').value);
    let toDate = new Date(document.getElementById('toDate').value);
      
    // To calculate the time difference of two dates
    let Difference_In_Time = toDate.getTime() - fromDate.getTime();
      
    // To calculate the no. of days between two dates
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    let productPrice = document.getElementById('selectedProductPrice').value;

    let estimatedPrice = productPrice * Difference_In_Days;
    document.getElementById('estimatedPrice').value=estimatedPrice;

    let productName = document.getElementById('selectedProductName').value;

    let getDataType = document.getElementById('dataType').value;
    let type = getDataType;
    if (getDataType == 'Return') {
        type = getDataType;
    }

    if (productName == '') {
        alert('Please Select a Product')
    }else if (fromDate == 'Invalid Date') {
        alert('Please Select From Date')
    }else if (toDate == 'Invalid Date') {
        alert('Please Select To Date')
    }else if (fromDate > toDate) {
        alert('You can\'t select To Date before From Date')
    } else {
        Swal.fire({
            title: 'Your Estimated Price is $' + estimatedPrice +'.',
            text: "Do you want to procedure?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Procedure!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Success!',
                'Your Product has been ' + type + ' Successfully.',
                'success'
              )
    
              createProductBookOrReturnJSON(productName, estimatedPrice, type)
    
            }
        })

        document.getElementById('btnProductBookOrReturn').setAttribute('data-dismiss', 'modal')
        dismissModal()
    }
}




function confirmProductBook()
{
    let productName = document.getElementById('selectedProductPrice').value;
    let estimatedPrice = document.getElementById('estimatedPrice').value;

    document.getElementById('confirmProductBookMessage').innerHTML= "New text!";

    createProductBookJSON(productName, estimatedPrice)
}




function createProductBookOrReturnJSON(name, price, type) {
    productBookOrReturnJSONObj = [];
    
    item = {}
    item ["productName"] = name;
    item ["estimatedPrice"] = price;

    productBookOrReturnJSONObj.push(item);

    console.log(productBookOrReturnJSONObj);

    if(type == 'Book') {
        localStorage.setItem('productBookData', JSON.stringify(productBookOrReturnJSONObj)); 
    } else {
        localStorage.setItem('productReturnData', JSON.stringify(productBookOrReturnJSONObj)); 
    }
    
}


function dismissModal()
{
    document.getElementById('productBookOrReturnLabel').innerHTML='<i class="bi bi-bookmark-check"></i>  Book a Product'
    document.getElementById('fromDate').value=''
    document.getElementById('toDate').value=''
    document.getElementById('selectedProductName').value=''
    document.getElementById('selectedProductPrice').value=''
    document.getElementById('estimatedPrice').value=''
    document.getElementById('products').value=''
    document.getElementById('selectedProductMileage').value='Mileage:'
    $('.select2').select2();
}