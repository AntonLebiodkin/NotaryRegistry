
$('.delete-phone').click(function(){
    var form = $(this).parent().parent();
    form.remove();
});

$('#add_phone').click(function(){
    var form = "<div class='col-md-12'>\
                            <div class='col-md-12'>\
                                <p><strong>Тип:</strong></p>\
                            </div>\
                            <div class='form-group col-md-11 pull-left' style='margin-left: 0; padding-left: 0;'>\
                                <select class='input-large form-control' id='region' name='active'>\
                                    <option value='0'>Робочий</option>\
                                    <option value='1'>Приватний</option>\
                                </select>\
                            </div>\
                            <div class='col-md-1 pull-right'>\
                                <button type='button' class='btn btn-danger delete-phone'> X </button>\
                            </div>\
                        </div>\
                        <div class='form-group'>\
                            <label for='city'>Номер телефону:</label>\
                            <input type='text' class='form-control' id='city' name='city'>\
                        </div>";
    $('#notary-contacts').append(form)
});
$('.delete-phone').click(function(){
    var form = $(this).parent().parent();
    form.remove();
});


$('#office_add_notarius').click(function(){
    var notary_input = '<div class="row notary_input_block"> <input type="text" class="form-control col-md-10 notary_input" name="certificate" required="required">' +
                        '<button type="button" class="btn btn-danger office_delete_notarius col-md-1">Delete</button></div>';
    $('#office_notarius').append(notary_input);
    $('.office_delete_notarius').click(function(){
                var certificate = $(this).parent();
                certificate.remove();
             });
    return $('input.notary_input').keypress(function(){
        jQuery(function($) {

            $("input.notary_input").autocomplete({
                minLength: 0,
                source: 'load_certificates',
                focus: function( event, ui ) {
                    $( "#notary_input" ).val( ui.item.desc);
                    return false;
                }
            });
        });
    })
});
$('#office_edit_add_notarius').click(function(){
    var notary_input = '<div class="row notary_input_block"> <input type="text" class="form-control col-md-10 notary_input" name="certificate" required="required">' +
                        '<button type="button" class="btn btn-danger office_delete_notarius col-md-1">Delete</button></div>';
    $('#office_edit_notariuses').append(notary_input);
    $('.office_delete_notarius').click(function(){
                var certificate = $(this).parent();
                certificate.remove();
             });
    return $('input.notary_input').keypress(function(){
        jQuery(function($) {

            $("input.notary_input").autocomplete({
                minLength: 0,
                source: 'load_certificates',
                focus: function( event, ui ) {
                    $( "#notary_input" ).val( ui.item.desc);
                    return false;
                }
            });
        });
    })
});
jQuery(function($) {
    $("input#search_certificate").autocomplete({
        minLength: 0,
        source: 'load_certificates',
        focus: function( event, ui ) {
            $( "#search_certificate" ).val( ui.item.desc);
            return false;
        }
    });
});

$('#region_search').change(function(){
    $('#office_res').children().remove();
    $('#office_search_error').empty();
    var region = $('#region_search').val();
    $('#search_office_name').find('option').remove();
    $.get('load_offices', {"region": region})
        .done(function(offices){

            $('#search_office_name').children().remove();
            $.each(offices, function(i, office){
                $('#search_office_name').append('<option>'+office.fields.name+'</option>')
                    .attr("value", i)
            });
    })
});


$('#general_region_search').change(function(){
    var region = $('#general_region_search').val();
    $('#general_city_search').find('option').remove();
    $.get('load_cities', {"region": region})
        .done(function(cities){
            $('#general_city_search').children().remove();
            $.each(cities, function(i, city){
                $('#general_city_search').append('<option>'+city.fields.city+'</option>')
                    .attr("value", i)
            });
    })
});




$(".notary_search").click(function(){
    var name = $('#search_name').val(),
        surname = $('#search_surname').val(),
        patronym = $('#search_patronym').val(),
        certificate = $('#search_certificate').val();
    $('#notarius_results').children().remove();
    $.get('notarius_search', {"certificate": certificate,
                              "name": name,
                              "surname": surname,
                              "patronym": patronym
                              },
        function(table){
            if (table == "None") {
                $('#notarius_search_error').text("Nothing was found");
            }
            else {
                $('#notarius_results').append(table);
            }
        });
});


$('.office_search').click(function(){
    $('#office_search_error').children().remove();
    var region = $('#region_search').val(),
        office = $('#search_office_name').val();


    $('#office_notariuses_search_result').children().remove();
    $.get('office_search', {'region': region, 'office': office})
        .done(function(res){
                if (res == "None"){
                    $('#office_search_error').text("Nothing was found");
                    return;
                }
                console.log("RES " + res);
                res = JSON.parse(res);
                var offices = res.table;
                $('#office_res').children().remove();
                $('#office_res').append(offices);
        });
});

$(".adress_search").click(function(){
    var region = $('#general_region_search').val(),
        city = $('#general_city_search').val(),
        street = $('#street_search').val();

    $.get('adress_search',   {"region": region,
                              "city": city,
                              "street": street
                              },
        function(table){
            if (table == "None") {
                $('#adress_search_error').text("Nothing was found");
            }
            else {
                $('#adress_search_res').append(table);
            }
        });
});


var notarius = {};
var notarius_object = {};

$('.delete_notarius').click(function(){
    notarius = $(this).parent().parent().children().find('.certificate').text();
    notarius_object = $(this).parent().parent();
    $.get('delete_notarius', {"notarius": notarius}, function(){
       notarius_object.remove();
    });

});

$('.delete_office').click(function(){
    console.log("delete");
    office = $(this).parent().parent().children().find('.office_name').text();
    office_object = $(this).parent().parent();
    $.get('delete_office', {"office": office}, function(){
       office_object.remove();
    });

});
var old_certificate = "";
$('.notarius_edit_open').click(function(){
    notarius = $(this).parent().parent().find('.certificate').text();
    $.get('get_notarius', {"certificate": notarius}, function(notariuses){
        var res = JSON.parse(notariuses);

        var notarius = JSON.parse(res.notarius)[0].fields,
            place = JSON.parse(res.place)[0].fields,
            phone = JSON.parse(res.phone)[0].fields,
            region = JSON.parse(res.region)[0].fields;



        $.get('load_regions', function(result){
            $('#notarius_edit_region').children().remove();
            $.each(result, function(i, region){
                $('#notarius_edit_region').append('<option>'+region.fields.name+'</option>')
                    .attr("value", i);
            });
            old_certificate = notarius.certificate_num;
            $('#edit_notarius_modal')
                .find('#notarius_edit_name').val(notarius.name).end()
                .find('#notarius_edit_surname').val(notarius.surname).end()
                .find('#notarius_edit_patronym').val(notarius.patronym).end()
                .find('#notarius_edit_certificate').val(notarius.certificate_num).end()
                .find('#notarius_edit_region').val(region.name).end()
                .find('#notarius_edit_city').val(place.city).end()
                .find('#notarius_edit_street').val(place.street).end()
                .find('#notarius_edit_building').val(place.building).end()
                .find('#notarius_edit_phone').val(phone.phone_number).end();
        });

    })
});

$('.edit_save_notarius').click(function(){
    var name = $('#notarius_edit_name').val(),
        surname = $('#notarius_edit_surname').val(),
        patronym = $('#notarius_edit_patronym').val(),
        certificate = $('#notarius_edit_certificate').val(),
        region = $('#notarius_edit_region').val(),
        city = $('#notarius_edit_city').val(),
        street = $('#notarius_edit_street').val(),
        building = $('#notarius_edit_building').val(),
        phone = $('#notarius_edit_phone').val();


    $.get('update_notarius', {
        'name': name,
        'surname': surname,
        'patronym': patronym,
        'old_certificate': old_certificate,
        'certificate': certificate,
        'region': region,
        'city': city,
        'street': street,
        'building': building,
        'phone': phone
    })
});
var prev_office_name = "";
$('.office_edit_open').click(function(){
    var office = $(this).parent().parent().find('.office_name').text();

    $.get('get_office', {"name": office}, function(office){
        var res = JSON.parse(office);

        var office = JSON.parse(res.office)[0].fields,
            notariuses = JSON.parse(res.notariuses),
            place = JSON.parse(res.place)[0].fields,
            phone = JSON.parse(res.phone)[0].fields,
            region = JSON.parse(res.region)[0].fields;

        prev_office_name = office.name;
        console.log(notariuses);



        $.get('load_regions', function(result){
            $('#office_edit_region').children().remove();
            $.each(result, function(i, region){
                $('#office_edit_region').append('<option>'+region.fields.name+'</option>')
                    .attr("value", i);
            });
            //old_certificate = notarius.certificate_num;
            $('#edit_office_modal')
                .find('#office_edit_name').val(office.name).end()
                .find('#office_edit_region').val(region.name).end()
                .find('#office_edit_city').val(place.city).end()
                .find('#office_edit_street').val(place.street).end()
                .find('#office_edit_building').val(place.building).end()
                .find('#office_edit_phone_type').val(phone.type).end()
                .find('#office_edit_phone').val(phone.phone_number).end();
            $('.office_edit_notariuses').children().remove();
            $.each(notariuses, function(i, notarius){
                console.log(notarius.fields.certificate_num);
                $('#office_edit_notariuses').append('<div class="row notary_input_block"> <p>'+notarius.fields.certificate_num+'</p>' +
                        '<button type="button" class="btn btn-danger office_delete_notarius col-md-1">Delete</button></div>');
            });
            $('.office_delete_notarius').click(function(){
                var certificate = $(this).parent();
                certificate.remove();
             });
            return $('input.notary_input').keypress(function(){
                jQuery(function($) {

                    $("input.notary_input").autocomplete({
                        minLength: 0,
                        source: 'load_certificates',
                        focus: function( event, ui ) {
                            $( "#notary_input" ).val( ui.item.desc);
                            return false;
                        }
                    });
                });
            })

        });

    })
});

$('.edit_save_office').click(function(){

    var name = $('#office_edit_name').val(),
        region = $('#office_edit_region').val(),
        city = $('#office_edit_city').val(),
        street = $('#office_edit_street').val(),
        building = $('#office_edit_building').val(),
        phone = $('#office_edit_phone').val();



    $.get('update_office', {
        'prev_name': prev_office_name,
        'name': name,
        'region': region,
        'city': city,
        'street': street,
        'building': building,
        'phone': phone
    })
});







/*$('input.notary_input').keypress(function(){
    console.log("FOCUSED");
    if ($(this).val().length == 4){
        $(this).sibling('.office_add_notarius').show();
    }

});*/
