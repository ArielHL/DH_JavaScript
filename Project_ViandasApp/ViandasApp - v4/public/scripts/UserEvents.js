let formDelete = document.querySelector('#form-address-delete');
console.log(formDelete);


formDelete.addEventListener('submit', function (e) {
    e.preventDefault();
   
    Swal.fire({ 
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
    }).then((result) => {
        if (result.isConfirmed) {
            formDelete.submit();
        }
    })
});