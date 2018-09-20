window.addEventListener('load', function() {
    var config = {
        fields: {
            address: 'ticket_ticket_field_1_data',
            geolocation: 'ticket_ticket_field_31_data',
        },
        labels: {
            addressSecret: 'Min adresse er hemmelig'
        },
        noAddressValue: '-'
    };

    var address = document.getElementById(config.fields.address);
    // var addressSecret = document.getElementById(config.fields.addressSecret);
    var geolocation = document.getElementById(config.fields.geolocation);

    if (null !== address) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'https://rawgit.com/rimi-itk/deskpro/master/deltagnu/dawa/dawa.css');
        document.querySelector('head').appendChild(link);

        var addressWrapper = document.createElement('div');
        addressWrapper.setAttribute('class', 'dawa-autocomplete-container');
        address.parentNode.replaceChild(addressWrapper, address);
        addressWrapper.appendChild(address);

        dawaAutocomplete.dawaAutocomplete(address, {
            select: function(selected) {
                fetch(selected.data.href)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(json) {
                        try {
                            var coords = json.adgangsadresse.adgangspunkt.koordinater;
                            if (null !== geolocation) {
                                geolocation.value = coords[0]+', '+coords[1];
                            }
                        } catch (e) {}
                    });
            }
        });

        var addressSecretWrapper = document.createElement('label');
        var addressSecret = document.createElement('input');
        addressSecret.setAttribute('type', 'checkbox');
        addressSecretWrapper.appendChild(addressSecret);
        addressSecretWrapper.appendChild(document.createTextNode(' '));
        addressSecretWrapper.appendChild(document.createTextNode(config.labels.addressSecret));
        addressWrapper.parentNode.insertBefore(addressSecretWrapper, addressWrapper.nextSibling);

        var toggleAddress = function() {
            if (addressSecret.checked) {
                addressWrapper.style.display = 'none';
                if (config.noAddressValue !== address.value) {
                    address.originalValue = address.value;
                }
                address.value = config.noAddressValue;
                if (null !== geolocation) {
                    geolocation.originalValue = geolocation.value;
                    geolocation.value = '';
                }
            } else {
                addressWrapper.style.display = 'block';
                address.value = address.originalValue || '';
                if (null !== geolocation) {
                    geolocation.value = geolocation.originalValue || '';
                }
            }
        }
        addressSecret.checked = config.noAddressValue === address.value;
        toggleAddress();
        addressSecret.addEventListener('change', toggleAddress);
    }
});
