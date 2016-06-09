
$('.delete-phone').click(function(){
    console.log("HELLO");
    var form = $(this).parent().parent();
    console.log(form);
    form.remove();
});

$('#add_phone').click(function(){
    console.log("HI");
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
    console.log("HELLO");
    var form = $(this).parent().parent();
    console.log(form);
    form.remove();
});


$('#office_add_notarius').click(function(){
    var notary_input = '<div class="row notary_input_block"> <input type="text" class="form-control col-md-10 notary_input" name="certificate" required="required">' +
                        '<button type="button" class="btn btn-danger office_delete_notarius col-md-1">Delete</button></div>';
    $('#office_notarius').append(notary_input);
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
            $('.office_delete_notarius').click(function(){
                console.log("CLIIIIICK");
                var certificate = $(this).parent();
                certificate.remove();
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
    console.log('changed');
    var region = $('#region_search').val();
    $('#search_office_name').find('option').remove();
    console.log(region);
    $.get('load_offices', {"region": region})
        .done(function(offices){
            console.log(offices);

            $.each(offices, function(i, office){
                console.log(office.fields.name);
                $('#search_office_name').append('<option>'+office.fields.name+'</option>')
                    .attr("value", i)
            });
    })
});

$('#general_region_search').change(function(){
    console.log('changed');
    var region = $('#general_region_search').val();
    $('#general_city_search').find('option').remove();
    console.log(region);
    $.get('load_cities', {"region": region})
        .done(function(cities){
            console.log(cities);
            $.each(cities, function(i, city){
                console.log(city.fields.city);
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
    console.log(name, surname, patronym, certificate);
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
    var region = $('#region_search').val(),
        office = $('#search_office_name').val();

    console.log(region, office);

    $('#office_res').children().remove();
    $('#office_notariuses_search_result').children().remove();
    $.get('office_search', {'office': office})
        .done(function(res){
                res = JSON.parse(res);
                var offices = res.table;
                console.log(offices);
                if (res == "None"){
                    $('#office_search_error').text("Nothing was found");
                }
                else {
                    $('#office_res').append(offices);
                }
        });
});

$(".adress_search").click(function(){
    var region = $('#general_region_search').val(),
        city = $('#general_city_search').val(),
        street = $('#street_search').val();

    console.log(region, city, street);
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
    console.log('CLICKED ON DELETE');
    console.log(notarius);
    console.log(typeof notarius);
    $.get('delete_notarius', {"notarius": notarius}, function(){
       notarius_object.remove();
    });

});
var old_certificate = "";
$('.notarius_edit_open').click(function(){
    notarius = $(this).parent().parent().find('.certificate').text();
    console.log("FROM EDIT " + notarius);
    $.get('get_notarius', {"certificate": notarius}, function(notariuses){
        var res = JSON.parse(notariuses);

        var notarius = JSON.parse(res.notarius)[0].fields,
            place = JSON.parse(res.place)[0].fields,
            phone = JSON.parse(res.phone)[0].fields,
            region = JSON.parse(res.region)[0].fields;

        console.log(notarius);
        console.log(place.city, place.street, place.building);
        //console.log(phone);
        console.log("REGION");
        console.log(region.name);

        $.get('load_regions', function(result){
            console.log(result);
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
            console.log(place);
            console.log(notarius);
        });

    })
});


$('.edit_save_notarius').click(function(){
    var name = decodeURI($('#notarius_edit_name').val()),
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
    }, function(){
        console.log('Вроде пашет');
    })

});





/*$('input.notary_input').keypress(function(){
    console.log("FOCUSED");
    if ($(this).val().length == 4){
        $(this).sibling('.office_add_notarius').show();
    }

});*/