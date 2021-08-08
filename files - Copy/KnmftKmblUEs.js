Ext.application({
    name: 'Fiddle',

    launch: function () {
        console.log(this);
        Ext.define('Strategies', {
            extend: 'Ext.data.Model',
            fields: ['strategyId', 'strategyIdVal', 'bucketType', 'bucketTypeVal']
        });

        var userStore = Ext.create('Ext.data.Store', {
            model: 'Strategies',
            data: [{
                strategyId: 'Normal Pay Customers',
                strategyIdVal: -1,
                bucketType: 'Overdue',
                bucketTypeVal: 1,
            }, {
                strategyId: 'Normal Pay Customers',
                strategyIdVal: -1,
                bucketType: 'Due Within',
                bucketTypeVal: 2,
            }, {
                strategyId: 'Fast Pay Customers',
                strategyIdVal: 2,
                bucketType: 'Overdue',
                bucketTypeVal: 1,
            }, {
                strategyId: 'Slow Pay Customers',
                strategyIdVal: 1,
                bucketType: 'Due Within',
                bucketTypeVal: 2,
            }, {
                strategyId: 'Large Pay Customers',
                strategyIdVal: 3,
                bucketType: 'Overdue',
                bucketTypeVal: 1,
            }, ]
        });

        var grid = Ext.create('Ext.grid.Panel', {
            itemId: 'grid',
            store: userStore,
            storeId: 'mystore',
            selType: 'checkboxmodel',
            width: '100%',
            height: 300,
            flex: 1,
            title: 'Application Users',
            columns: [{
                text: 'Strategy ID',
                width: 100,
                sortable: false,
                flex: 1,
                dataIndex: 'strategyId'
            }, {
                text: 'Strategy ID Value',
                width: 100,
                dataIndex: 'strategyIdVal',
                hidden: true
            }, {
                text: 'Bucket Type',
                flex: 1,
                dataIndex: 'bucketType',
            }, {
                text: 'Bucket Type Value',
                width: 100,
                dataIndex: 'bucketTypeVal',
                hidden: true
            }]
        });

        grid.selModel.checkOnly = true;

        grid.on('rowclick', function () {
            //console.log(strategyIdStore.data.items[0].data);
        }, this);

        var i = 0;

        grid.on('select', function (g, a, rowIndex) {
            var newComp = new createPanel(rowIndex);
            anotherPanel.insert(0, newComp);
            grid.selModel.selectionMode = 'SINGLE';
            var overlapPanel = Ext.ComponentQuery.query("#another")[0];
            var innerPnl = Ext.ComponentQuery.query("#parent")[0];
            var outerGrd = Ext.ComponentQuery.query("#grid")[0];
            innerPnl.add(overlapPanel);
            outerGrd.setFlex(0.5);
            overlapPanel.setFlex(0.5);
            overlapPanel.setWidth('50%');
            //outerGrd.updateLayout();
        }, this);

        grid.on('deselect', function () {
            var formComponent = anotherPanel.items.items[0];
            anotherPanel.remove(formComponent);
            formComponent?.destroy();
            grid.selModel.selectionMode = 'MULTI';
            var overlapPanel = Ext.ComponentQuery.query("#another")[0];
            var innerPnl = Ext.ComponentQuery.query("#parent")[0];
            var outerGrd = Ext.ComponentQuery.query("#grid")[0];
            outerGrd.setFlex(1);
            overlapPanel.setFlex(0);
            overlapPanel.setWidth(0);
        }, this);

        var bucketTypeIdStore = Ext.create('Ext.data.Store', {
            fields: ['displayName', 'value'],
            data: [{
                "displayName": "Overdue",
                "value": 1
            }, {
                "displayName": "Due Within",
                "value": 2
            }, ]
        });

        var strategyIdStore = Ext.create('Ext.data.Store', {
            fields: ['displayName', 'value'],
            data: [{
                "displayName": "Normal Customer",
                "value": -1
            }, {
                "displayName": "Slow Pay Customers",
                "value": 1
            }, {
                "displayName": "Fast Pay Customers",
                "value": 2
            }, {
                "displayName": "Large Pay Customers",
                "value": 3
            }, {
                "displayName": "ABC Customers",
                "value": 4
            }]
        });

        var rowIndex = 0;
        var oldRecord = '';
        var hasEdited = false;
        var bucketId = '';
        var strategyId = '';
        var editObj = {};
        
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2,
            autoUpdate: true,
            listeners: {
                beforeedit: function (editor, context, eOpts) {
                    if (hasEdited) {
                        Ext.Msg.alert('Warning', 'Save the changed record to enable further edits.', Ext.emptyFn);
                        return false;
                    }
                    rowIndex = context.rowIdx;
                    oldRecord = JSON.stringify(context.record.data);

                    // var buttonsContainer = cmp.editor.floatingButtons;
                    // // if we haven't done so hide the buttons
                    // //
                    // if (!buttonsContainer.buttonsHidden) {
                    //     buttonsContainer.items.each(function (btn) {
                    //         btn.hidden = true;
                    //     });
                    //     buttonsContainer.padding = 0;
                    //     buttonsContainer.buttonsHidden = true;
                    // }

                    var dataFields = editor.grid.columns;

                    dataFields[0].setEditor({
                        editable: true,
                        xtype: 'combobox',
                        itemId: 'strategyColumnCombo',
                        displayField: 'displayName',
                        valueField: 'value',
                        store: strategyIdStore,
                        queryMode: 'local',
                        allowBlank: false,
                        listeners: {
                            select: function (editor, context, eOpts) {
                                strategyId = editor.value;
                                if(bucketId === '') bucketId = userStore.data.items[rowIndex].data.bucketTypeVal;
                                for (var i = 0; i < userStore.data.items.length; i++) {
                                    if (i === rowIndex) {} 
                                    else if (userStore.data.items[i].data.bucketTypeVal === bucketId && userStore.data.items[i].data.strategyIdVal === editor.value) {
                                        Ext.MessageBox.alert("Alert", userStore.data.items[i].data.strategyId + " is already aligned with another mapping. Please try selecting another field.");
                                        return;
                                    }
                                }
                                editor.value = editor.rawValue;
                            }
                        }
                    });

                    dataFields[2].setEditor({
                        editable: true,
                        xtype: 'combobox',
                        itemId: 'creditColumnCombo',
                        displayField: 'displayName',
                        valueField: 'value',
                        queryMode: 'local',
                        store: bucketTypeIdStore,
                        allowBlank: false,
                        listeners: {
                            select: function (editor, context, eOpts) {
                                bucketId = editor.value;
                                if(strategyId === '') strategyId = userStore.data.items[rowIndex].data.strategyIdVal;
                                for (var i = 0; i < userStore.data.items.length; i++) {
                                    if (i === rowIndex) {} 
                                    else if (userStore.data.items[i].data.bucketTypeVal === editor.value && userStore.data.items[i].data.strategyIdVal === strategyId) {
                                        Ext.MessageBox.alert("Alert", userStore.data.items[i].data.bucketType + " is already aligned with another mapping. Please try selecting another field.");
                                        return;
                                    }
                                }
                                editor.value = editor.rawValue;
                            }
                        }
                    });
                },

                edit: function (editor, context, eOpts) {
                    var modifiedRecord = Ext.ComponentQuery.query("grid")[0].getStore().getModifiedRecords()[rowIndex].data;
                    context.record.set("strategyIdVal", strategyId);
                    context.record.set("bucketTypeVal", bucketId);
                    hasEdited = oldRecord.valueOf() != JSON.stringify(modifiedRecord).valueOf();
                }
            }

        });

        grid.addPlugin(rowEditing);

        var addStrategy = new Ext.Button({
            text: 'Add',
            //tooltip : 'Add Strategy',
            itemId: 'addStrategy',
            //iconCls : 'create',
            //autoid: cam.slimfast.admin.credit.accountSpecificConfiguration.manageAgingBuckets.dataTypeId + ":" + menuId +":addFilterMappingCriteria",
            //actionIdentifier : dms.admin.tree.administrationDataTypeId + ":" + cam.slimfast.admin.credit.accountSpecificConfiguration.manageAgingBuckets.menuId +":addStrategy",
            handler: function () {
                //var filterMappingGrid = Ext.ComponentQuery.query("#commitmentFilterMappingsGrid")[0];
                var recId = userStore.getCount() - 1;
                var record = Ext.create(userStore.model.getName(), {
                    //     		strategyBucketId : -1,
                    //     		accountId : null,
                    //     		strategyId.strategyId : null,
                    //     		bucketTypeId.bucketTypeId : null,
                    //     		isDeleted : 0,
                    //     		createUser : null,
                    // createTime : null,
                    // updateUser : null,
                    // updateTime : null,
                    //commitFieldId : null,
                    //dedFieldId : null
                    Name: null,
                    Phone: null

                });
                userStore.insert(recId + 1, record);
            }
        });
        var deletedRecordsAr = [];
        var removeStrategy = new Ext.Button({
            text: 'Delete',
            flex: 0.5,
            //	tooltip : 'Remove Record',
            itemId: 'removeStrategy',
            //iconCls : 'delete',
            //autoid: dms.admin.tree.administrationDataTypeId + ":" + menuId +":removeStrategy",
            //actionIdentifier : cam.slimfast.admin.credit.accountSpecificConfiguration.manageAgingBuckets.dataTypeId + ":" + cam.slimfast.admin.credit.accountSpecificConfiguration.manageAgingBuckets.menuId +":removeFilterMappingCriteria",
            handler: function () {
                var mappingGrid = Ext.ComponentQuery.query("#grid")[0];
                var records = mappingGrid.getSelectionModel().getSelection();
                if (records.length == 0) {
                    Ext.Msg.alert('Warning', 'No Records are selected to delete');
                } else {
                    Ext.Msg.confirm('Remove', 'Do you want to delete the selected filter criteria mappings?',
                        function (btn, text) {
                            if (btn == 'yes') {
                                for (var i = 0; i < records.length; i++) {
                                    deletedRecordsAr.push(records[i]);
                                    mappingGrid.store.remove(records[i]);

                                }
                            } else {
                                return;
                            }
                        }
                    )

                }
            }
        });

        var submitButton = new Ext.Button({
            text: 'Submit',
            //	tooltip : 'Remove Record',
            itemId: 'submitButton',
            flex: 0.5,
            margin: '0 20',
            //iconCls : 'delete',
            //autoid: dms.admin.tree.administrationDataTypeId + ":" + menuId +":removeStrategy",
            //actionIdentifier : cam.slimfast.admin.credit.accountSpecificConfiguration.manageAgingBuckets.dataTypeId + ":" + cam.slimfast.admin.credit.accountSpecificConfiguration.manageAgingBuckets.menuId +":removeFilterMappingCriteria",
            handler: function () {
                hasEdited = false;
            }
        });

        var toolbar = Ext.create("Ext.panel.Panel", {
            itemId: 'toolbar',
            layout: "hbox",
            margin: '10 20',
            width: "500",
            items: [addStrategy]
        });

        var toolbar1 = Ext.create("Ext.panel.Panel", {
            itemId: 'toolbar1',
            //layout: "hbox",
            margin: '0 10',
            width: "100%",
            layout: 'hbox',
            items: [{
                xtype: 'component',
                flex: 4
            },removeStrategy, submitButton]
        });

        var form = Ext.create('Ext.form.Panel', {
            title: 'Simple Form',
            bodyPadding: 5,
            width: 350,

            // The form will submit an AJAX request to this URL when submitted
            // url: 'save-form.php',

            // Fields will be arranged vertically, stretched to full width
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },

            // The fields
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'First Name',
                name: 'first',
                allowBlank: false
            }, {
                fieldLabel: 'Last Name',
                name: 'last',
                allowBlank: false
            }],

            // Reset and Submit buttons
            buttons: [{
                text: 'Reset',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            }, {
                text: 'Submit',
                formBind: true, //only enabled once the form is valid
                disabled: true,
                handler: function () {
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            success: function (form, action) {
                                Ext.Msg.alert('Success', action.result.msg);
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failed', action.result.msg);
                            }
                        });
                    }
                }
            }]
        });

        var anotherPanel = Ext.create("Ext.panel.Panel", {
            itemId: 'another',
            items: [],
            flex: 0,
        });
        var parentPanel = Ext.create("Ext.panel.Panel", {
            //renderTo: Ext.getBody(),
            //itemId: "innerPanel" +menuId,
            itemId: 'parent',
            layout: "hbox",
            width: '100%',
            items: grid
        });

        var parentGridPanel = Ext.create("Ext.panel.Panel", {
            //itemId: 'parentGridPanel'+menuId,
            renderTo: Ext.getBody(),
            layout: 'vbox',
            //ex:1,
            //border : false,
            //scrollable :'y',// true,
            autoSize: true,
            //bodyStyle : 'background-color:#fff',
            // 		monitorValid : true,
            // 		buttonAlign : 'center',
            // 		draggable:true,
            // 		frame:true,
            //iconCls:'icon-grid',
            items: [toolbar, parentPanel, toolbar1]
        });
    }
});

getJson = function () {
    var rows = [{
        "lowValue": 0,
        "accountId": 75,
        "highValue": 1,
        "bucketName": "Bucket 1",
        "createTime": "Jul 20, 2021 8:27:02 AM",
        "createUser": "debjit.c@highradius.com",
        "updateTime": "Jul 20, 2021 8:27:02 AM",
        "updateUser": "debjit.c@highradius.com",
        "fkStrategyId": -1,
        "agingBucketId": 1,
        "fkBucketTypeId": 1,
        "pkStrategyBucketId": 13
    }, {
        "lowValue": 2,
        "accountId": 75,
        "highValue": 3,
        "bucketName": "Bucket 2",
        "createTime": "Jul 20, 2021 8:27:02 AM",
        "createUser": "debjit.c@highradius.com",
        "updateTime": "Jul 20, 2021 8:27:02 AM",
        "updateUser": "debjit.c@highradius.com",
        "fkStrategyId": -1,
        "agingBucketId": 2,
        "fkBucketTypeId": 1,
        "pkStrategyBucketId": 49
    }, {
        "lowValue": 4,
        "accountId": 75,
        "highValue": 5,
        "bucketName": "Bucket 3",
        "createTime": "Jul 20, 2021 8:27:02 AM",
        "createUser": "debjit.c@highradius.com",
        "updateTime": "Jul 20, 2021 8:27:02 AM",
        "updateUser": "debjit.c@highradius.com",
        "fkStrategyId": -1,
        "agingBucketId": 3,
        "fkBucketTypeId": 1,
        "pkStrategyBucketId": 50
    }, {
        "lowValue": 6,
        "accountId": 75,
        "highValue": 7,
        "bucketName": "Bucket 4",
        "createTime": "Jul 20, 2021 8:27:03 AM",
        "createUser": "debjit.c@highradius.com",
        "updateTime": "Jul 20, 2021 8:27:03 AM",
        "updateUser": "debjit.c@highradius.com",
        "fkStrategyId": -1,
        "agingBucketId": 4,
        "fkBucketTypeId": 1,
        "pkStrategyBucketId": 51
    }, {
        "lowValue": 8,
        "accountId": 75,
        "highValue": 9,
        "bucketName": "Bucket 5",
        "createTime": "Jul 20, 2021 8:27:03 AM",
        "createUser": "debjit.c@highradius.com",
        "updateTime": "Jul 20, 2021 8:27:03 AM",
        "updateUser": "debjit.c@highradius.com",
        "fkStrategyId": -1,
        "agingBucketId": 5,
        "fkBucketTypeId": 1,
        "pkStrategyBucketId": 52
    }, {
        "lowValue": 10,
        "accountId": 75,
        "highValue": null,
        "bucketName": "bucket 6",
        "createTime": "Jul 20, 2021 8:27:03 AM",
        "createUser": "debjit.c@highradius.com",
        "updateTime": "Jul 20, 2021 8:27:03 AM",
        "updateUser": "debjit.c@highradius.com",
        "fkStrategyId": -1,
        "agingBucketId": 6,
        "fkBucketTypeId": 1,
        "pkStrategyBucketId": 419
    }];
    var obj = {
        "msg": null,
        "success": true,
        "customValues": {},
        "excludeCalsess": null
    };
    var result = Math.floor(Math.random() * 6) + 1;
    obj["rows"] = rows.slice(0, 6);
    obj["results"] = result;
    return JSON.stringify(obj);
}

createPanel = function (rowId) {
    console.log('From create panel: ', rowId);
    //cms.admin.collections.strategy.attributes=attributes;
    itemId: 'createPanel';
    autoid: 'cmsAdminCollectionsStrategyPanel';
    var existingDetails = getJson();
    var existingBuckets = Ext.util.JSON.decode(existingDetails);
    console.log(existingBuckets);
    //var existingBuckets = existingDetails;
    var strategyKeys = [];
    var bucketKeys = [];
    var noOfExistingBuckets = existingBuckets['results'];
    var bucketName;

    if (existingBuckets['results'] != 0) { //If already some Buckets exists
        var numberFieldIds = 1;
        for (var j = 1; j <= existingBuckets['results']; j++) {

            var bucket = createBucket(numberFieldIds, true, existingBuckets.rows[j - 1].lowValue, existingBuckets.rows[j - 1].highValue, existingBuckets.rows[j - 1].bucketName, noOfExistingBuckets);
            numberFieldIds = numberFieldIds + 2;
            bucketKeys.push(existingBuckets.rows[j - 1].pkStrategyBucketId);
            if (j == 1) {
                var form1 = createForm(true);
            }
            if (j - 1 > 0) {
                //var previousBucket = Ext.getCmp('bucket' + (j - 1));
                var previousBucket = Ext.ComponentQuery.query("#bucket" + (j - 1))[Ext.ComponentQuery.query("#bucket" + (j - 1)).length - 1]
                previousBucket.items.items[6].hide();
            }
            //Ext.getCmp('formId').add(bucket);
            Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1].add(bucket);
        }
        buttonCheck();
        strategyKeys = Ext.encode(bucketKeys);
        //Ext.getCmp('formId').updateLayout();
        Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1].updateLayout();
    } else {
        var bucket = createBucket(1, false);
        var form1 = createForm(false, '110055');
        //Ext.getCmp('formId').add(bucket);
        Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1].add(bucket);
        //var bucket_Panel = Ext.getCmp('bucket' + 1);
        var bucket_Panel = Ext.ComponentQuery.query("#bucket" + 1)[Ext.ComponentQuery.query("#bucket" + 1).length - 1]
        bucket_Panel.show();
        //Ext.getCmp('formId').updateLayout();
        Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1].updateLayout();
    }

    var mainPanel = new Ext.Panel({
        itemId: 'mainPanel',
        autoid: 'cmsBucketsAssignmentsMainPanel',
        title: 'Edit Aging Buckets ' + rowId,
        autoHeight: false,
        border: true,
        autoScroll: true,
        //html: '<p>World!</p>',
        //renderTo: Ext.getBody(),
        items: [form1]
    });

    return mainPanel.show();
}

createBucket = function (id, flag, value1, value2, bucketName, nobuckets) {
    var form5 = Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1];
    if (form5 != undefined) {
        var clickid = (form5.items.length * 2 + 1);
        var oldValue = form5.items.items[form5.items.length - 1].items.items[4].items.items[0].value;
    }
    var noIds = (nobuckets * 2 - 1);
    if (id == 1) {
        bucketId = parseInt(id);
    } else {
        bucketId = parseInt(bucketId) + 1;
    }
    var previousId = (parseInt(id) - 1);
    var id2 = (parseInt(id) + 1);
    var id4 = (parseInt(id2) + 1);
    var emptyLabel = new Ext.form.Label({
        itemId: 'emptyLabel' + id,
        autoid: 'cmsBucketFormEmptyLabel',
        width: 20,
        html: '&nbsp;'
    });
    var greaterField;
    if (id == 1 && flag == true) {
        greaterField = '&nbsp;&nbsp;';
    } else if (id == 1 && flag == false) {
        greaterField = '>=';
    } else if (id == noIds) {
        greaterField = '>=';
    } else {
        greaterField = '&nbsp;&nbsp;';
    }
    var numberField1 = new Ext.form.NumberField({
        width: 50,
        height: 20,
        name: 'numberField' + id,
        itemId: 'numberField1' + id,
        autoid: 'cmsBucketFormMinValue',
        allowBlank: false,
        allowDecimals: false,
        allowNegative: false,
        readOnly: true,
        //value: (id == 1) ? 0 : (Ext.getCmp('numberField1' + previousId).getValue() + 1)
        value: (id == 1) ? 0 : (Ext.ComponentQuery.query("#numberField1" + previousId)[Ext.ComponentQuery.query("#numberField1" + previousId).length - 1].getValue() + 1)
    });
    if (flag) {
        //Ext.getCmp('numberField1' + id).setValue(value1);
        Ext.ComponentQuery.query("#numberField1" + id)[Ext.ComponentQuery.query("#numberField1" + id).length - 1].setValue(value1);
    }
    if (oldValue != undefined && oldValue != "" && id != 1) {
        //Ext.getCmp('numberField1' + id).setValue(parseInt(oldValue) + 1); //Ext.getCmp('numberField1' + previousId).getValue() + 1);
        Ext.ComponentQuery.query("#numberField1" + id)[Ext.ComponentQuery.query("#numberField1" + id).length - 1].setValue(parseInt(oldValue) + 1);
    }
    var a = 0;
    var numberField2 = new Ext.form.NumberField({
        width: 70,
        height: 20,
        name: 'numberField' + id2,
        itemId: 'numberField1' + id2,
        autoid: 'cmsBucketFormMaxValue',
        allowDecimals: false,
        allowNegative: false,
        maxLength: 3,
        enableKeyEvents: true,
        value: value2,
        stripCharsRe: /[.-]/,
        listeners: {
            'keyup': function (txt, newValue, oldValue) {
                if (numberField2.getValue() != '' && numberField2.getValue() != null) {
                    if (numberField1.getValue() < numberField2.getValue()) {
                        //Ext.getCmp('numberField1' + id2).setValue(numberField2.getValue());
                        Ext.ComponentQuery.query("#numberField1" + id2)[Ext.ComponentQuery.query("#numberField1" + id2).length - 1].setValue(numberField2.getValue());
                        buttonCheck();
                        //if (Ext.getCmp('numberField1' + id4) != undefined) {
                        //    Ext.getCmp('numberField1' + id4).setValue(numberField2.getValue() + 1); // Ext.getCmp('numberField1'+previousId).getValue()+1);
                        //}
                        if (Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id).length - 1] != undefined) {
                            Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id).length - 1].setValue(numberField2.getValue() + 1);
                        }
                    } else {
                        //Ext.getCmp('button1').disable();
                        Ext.ComponentQuery.query("#button1" + id4)[Ext.ComponentQuery.query("#button1" + id).length - 1].disable();
                    }
                    if (Ext.ComponentQuery.query("#numberField1" + (id4 + 1))[Ext.ComponentQuery.query("#numberField1" + (id4 + 1)).length - 1] != undefined && Ext.ComponentQuery.query("#numberField1" + (id4 + 1))[Ext.ComponentQuery.query("#numberField1" + (id4 + 1)).length - 1].getValue() != '') {
                        if (!(numberField2.getValue() < (Ext.ComponentQuery.query("#numberField1" + (id4 + 1))[Ext.ComponentQuery.query("#numberField1" + (id4 + 1)).length - 1].getValue() - 1))) {
                            Ext.ComponentQuery.query("#numberField1" + (id4 + 1))[Ext.ComponentQuery.query("#numberField1" + (id4 + 1)).length - 1].setValue('');
                            if (Ext.ComponentQuery.query("#numberField1" + (id4 + 2))[Ext.ComponentQuery.query("#numberField1" + (id4 + 2)).length - 1] != undefined) {
                                Ext.ComponentQuery.query("#numberField1" + (id4 + 1))[Ext.ComponentQuery.query("#numberField1" + (id4 + 1)).length - 1].allowBlank = false;
                            }
                            Ext.Msg.alert('Warning', 'You have entered wrong input');
                        }
                    }
                } else {
                    if (Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id4).length - 1] != undefined) {
                        Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id4).length - 1].setValue('');
                    }
                }
            }, //End Of 'key up' Listener
            'keydown': function (txt, newValue, oldValue) {
                if (numberField2.getValue() != '' && numberField2.getValue() != null) {
                    if (numberField1.getValue() < numberField2.getValue()) {
                        if (Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id4).length - 1] != undefined) {
                            Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id4).length - 1].setValue(numberField2.getValue() + 1); // Ext.getCmp('numberField1'+previousId).getValue()+1);
                        }
                        buttonCheck();
                    } else {
                        Ext.ComponentQuery.query("#button1")[Ext.ComponentQuery.query("button1").length - 1].disable();
                    }
                } else {
                    if (Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id4).length - 1] != undefined) {
                        Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id4).length - 1].setValue('');
                    }
                }
            }, //End Of 'key down' Listener
            'blur': function (field) {
                if (Ext.ComponentQuery.query("#numberField1" + (id4 + 1))[Ext.ComponentQuery.query("#numberField1" + (id4 + 1)).length - 1] != undefined && Ext.ComponentQuery.query("#numberField1" + (id4 + 1))[Ext.ComponentQuery.query("#numberField1" + (id4 + 1)).length - 1].getValue() != '') {
                    if (!(numberField2.getValue() < (Ext.ComponentQuery.query("#numberField1" + (id4 + 1))[Ext.ComponentQuery.query("#numberField1" + (id4 + 1)).length - 1].getValue() - 1))) {
                        numberField2.setValue('');
                        Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id4).length - 1].setValue('');
                        Ext.Msg.alert('Warning', dms.i18n.admin.bucketWrongInput);
                    }
                }
                if (!(numberField1.getValue() < numberField2.getValue())) {
                    numberField2.setValue('');
                    if (Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id4).length - 1] != undefined) {
                        Ext.Msg.alert('Warning', dms.i18n.admin.bucketWrongInput);
                        Ext.ComponentQuery.query("#numberField1" + id4)[Ext.ComponentQuery.query("#numberField1" + id4).length - 1].setValue('');
                    }
                }
                buttonCheck();
            }, //End Of 'blur' Listener
            'invalid': function (e) {
                Ext.ComponentQuery.query("#button1")[Ext.ComponentQuery.query("#button1").length - 1].disable();
            }
        } //End Of Listeners
    });

    var bucketNameField = new Ext.form.TextField({
        width: 200,
        height: 20,
        name: 'bucketNameField' + id,
        itemId: 'bucketNameField' + id,
        autoid: 'cmsBucketNameField',
        allowBlank: false,
        allowDecimals: false,
        allowNegative: false,
        readOnly: false,
        enableKeyEvents: true,
        value: bucketName,
        validator: function (r) {
            if (r != r.trim()) {
                return 'Please Remove Leading and Trailing spaces';
            }
            if ((r.indexOf("\"") != -1) || (r.indexOf(",") != -1) || (r.indexOf("\\") != -1) || (r.indexOf('/') != -1) || (r.indexOf("&") != -1) || (r.indexOf("^") != -1) || (r.indexOf(":") != -1) || (r.indexOf("\\\"") != -1)) {
                return 'Please Remove Special Characters';
            }
            return true;
        },
        listeners: {
            'change': function (currentObject, newValue) {
                this.value = newValue;
            }
        }
    });

    var greaterSymbol12 = new Ext.form.Label({
        text: '>=',
        itemId: 'greaterField12' + id,
        autoid: 'cmsBucketGreaterSymbol',
        width: 20
    });
    var removeButton = new Ext.Button({
        itemId: 'removeButton' + id,
        autoid: 'cmsRemoveBucketSymbol',
        iconCls: 'remove',
        width: 20,
        tooltip: 'Remove Bucket',
        handler: function () {
            var form6 = Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1];
            if (form6.items.length != 1) {
                form6.remove(Ext.ComponentQuery.query("#bucket" + (form6.items.length))[Ext.ComponentQuery.query("#bucket" + (form6.items.length)).length - 1]);
                bucketId--;
                clickCount1--;
                clickid = clickid - 2;
            }
            if (form6.items.length == 1) {
                var bucketPanel11 = Ext.ComponentQuery.query("#bucket" + 1)[Ext.ComponentQuery.query("#bucket" + 1).length - 1];
            }
            Ext.ComponentQuery.query("#bucket" + (form6.items.length))[Ext.ComponentQuery.query("#bucket" + (form6.items.length)).length - 1].remove(Ext.ComponentQuery.query("#bucket" + (form6.items.length))[Ext.ComponentQuery.query("#bucket" + (form6.items.length)).length - 1].items.item(1));
            Ext.ComponentQuery.query("#bucket" + (form6.items.length))[Ext.ComponentQuery.query("#bucket" + (form6.items.length)).length - 1].insert(1, greaterSymbol12);
            Ext.ComponentQuery.query("#bucket" + (form6.items.length))[Ext.ComponentQuery.query("#bucket" + (form6.items.length)).length - 1].updateLayout();
            if (form6.items.length != 1) {
                Ext.ComponentQuery.query("#bucket" + (form6.items.length))[Ext.ComponentQuery.query("#bucket" + (form6.items.length)).length - 1].items.item(6).show();
            }
            Ext.ComponentQuery.query("#numberField1" + form6.items.length * 2)[Ext.ComponentQuery.query("#numberField1" + form6.items.length * 2).length - 1].allowBlank = true;
            buttonCheck();
            form6.updateLayout();
        }
    }); //End Of removeButton definition
    if (id == 1) {
        var tempRemoveButton = emptyLabel;
        //var rm = '&nbsp;&nbsp;';
    } else {
        var tempRemoveButton = removeButton;
    }
    var panelnew111 = {
        xtype: 'fieldset',
        itemId: 'bucket' + bucketId,
        autoid: 'cmsBucketColumnPanel',
        monitorValid: true,
        hideBorders: true,
        maskOnDisable: false,
        hideLabel: true,
        monitorResize: true,
        frame: false,
        header: false,
        style: 'border-width: 0px',
        width: 1000,
        height: 100,
        layout: 'column',
        items: [{
            columnWidth: .11,
            border: false,
            html: '<span class="x-form-item">Bucket' + bucketId + '&nbsp;:</span>'
        }, {
            columnWidth: .03,
            border: false,
            html: greaterField
        }, {
            columnWidth: .11,
            border: false,
            alignment: 'right',
            items: numberField1
        }, {
            columnWidth: .06,
            border: false,
            html: '<span class="x-form-item">To</span>'
        }, {
            columnWidth: .10,
            border: false,
            items: numberField2
        }, {
            columnWidth: .25,
            border: false,
            items: bucketNameField
        }, {
            columnWidth: .06,
            border: false,
            items: tempRemoveButton
        }]
    };
    return panelnew111;
}; //

createForm = function (flag, attributesData) {
    var greaterField1 = new Ext.form.Label({
        text: '>=',
        itemId: 'greaterField1',
        autoid: 'cmsBucketOperatorField',
        width: 20
    });
    var buttons = [{
            text: 'Add Bucket',
            itemId: 'button1',
            autoid: 'cmsAddBucketBtn',
            //actionIdentifier: dms.admin.tree.administrationDataTypeId + ":" + attributesData.menuId + ":addBucket",
            disabled: true,
            tooltip: 'Add New Bucket',
            handler: function () {
                if (this.clickCount) {
                    var form2 = Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1];
                    this.clickCount = form2.items.length;
                    clickid = form2.items.length * 2 + 1;
                    if (this.clickCount <= 11) {
                        this.clickCount++;
                        clickCount1++;
                        assignEmptyLabel(clickCount1);
                        assignSymbol(clickid, this.clickCount);
                        clickid = clickid + 2;
                        Ext.ComponentQuery.query("#button1")[Ext.ComponentQuery.query("#button1").length - 1].disable();
                        form1.updateLayout();
                    }
                } else {
                    var form3 = Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1];
                    if (flag) {
                        this.clickCount = form3.items.length;
                    } else {
                        this.clickCount = 1;
                    }
                    clickCount1 = this.clickCount + 1;
                    if (this.clickCount <= 11) {
                        if (flag) {
                            clickid = (form3.items.length * 2 + 1);
                        } else {
                            clickid = 3;
                        }
                        assignEmptyLabel(clickCount1);
                        assignSymbol(clickid, this.clickCount + 1);
                    }
                    Ext.ComponentQuery.query("#button1")[Ext.ComponentQuery.query("#button1").length - 1].disable();
                    form1.updateLayout();
                }
            }
        } //End Of 'Add Bucket' button definition
        , {
            text: 'Submit',
            //actionIdentifier: dms.admin.tree.administrationDataTypeId + ":" + attributesData.menuId + ":submitBucket",
            formBind: true,
            handler: function () {
                    var waitMsg;
                    waitMsg = 'Wait';
                    var form4 = Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1];
                    var noBuckets = form4.items.length;
                    if (form4.items.items[noBuckets - 1].items.items[4].items.items[0].value != '' &&
                        form4.items.items[noBuckets - 1].items.items[4].items.items[0].value != undefined) {
                        Ext.Msg.alert('Warning', 'Last bucket high value should be empty, please remove it and resubmit');
                    } else {
                        var bucketValues = [];
                        for (var i = 1; i <= noBuckets; i++) {
                            var formatString;
                            var el = Ext.ComponentQuery.query("#bucket" + i)[Ext.ComponentQuery.query("#bucket" + i).length - 1];
                            formatString = i + ':' + el.items.items[2].items.items[0].value + ':' + el.items.items[4].items.items[0].value + ':' + el.items.items[5].items.items[0].value;
                            bucketValues.push(formatString);
                        }
                        var valuesArray = Ext.encode(bucketValues);
                        form1.getForm().submit({
                            url: resolveCMSPath('addBucketsTOStrategy.do'),
                            params: {
                                bucketValuesArray: valuesArray,
                                strategyBucketIds: strategyKeys
                            },
                            method: 'POST',
                            waitMsg: waitMsg,
                            success: function (form, action) {
                                if (action.result.msg == 'Failed to add Buckets') { // Failed
                                    Ext.Msg.minWidth = 150;
                                    Ext.Msg.alert('Warning', 'Some Error occured ', function (btn, text) {});
                                } else {

                                    Ext.example.msg('Success', action.result.msg);
                                    var attributes = {};
                                    attributes.text = 'Manage Buckets';
                                    attributes.leaf = true;
                                    attributes.menuId = '84051';
                                    attributes.id = '11002';
                                    //var comp = dms.admin.tree.createTreeNodeComponent('cms.admin.collections.strategy.createPanel', attributes);
                                    //Ext.getCmp('contentadmin-panel').add(comp);
                                    //Ext.getCmp('contentadmin-panel').layout.setActiveItem(comp.id);
                                }
                            },
                            failure: function (form, action) {
                                form.destroy();
                                //Ext.example.msg('failed', dms.i18n.admin.addBucketsFailedMsg);
                            }
                        }); // End of Submit action
                    }
                } // End of handler
        }
    ]; //End Of buttons definition
    var form1 = new Ext.FormPanel({
        itemId: 'formId',
        autoid: 'cmsFormForBucketsAssignment',
        width: 1000,
        //height: 600,
        monitorValid: true,
        autoHeight: true,
        expandOnShow: false,
        labelWidth: 120,
        bodyStyle: 'background-color:#fff;',
        modal: true,
        layout: 'form',
        bodyBorder: false,
        buttonAlign: 'center',
        //buttons: buttons,
        padding: '8',
        items: []
    });
    return form1;
}; //End Of createForm(flag)

// To replace the '>=' symbol with empty space to the previous bucket of the last bucket. 
assignEmptyLabel = function (i) {
    var tempLabel = new Ext.form.Label({
        itemId: 'aa' + i,
        autoid: 'cmsBucketEmptyLabel',
        html: '<pre> &nbsp; </pre>',
        width: 30
    });
    var bucketPanel = Ext.ComponentQuery.query("#bucket" + (i - 1))[Ext.ComponentQuery.query("#bucket" + (i - 1)).length - 1];
    console.log(bucketPanel.items.items[6]);
    bucketPanel.items.items[6].hide();
    bucketPanel.remove(bucketPanel.items.items[1]);
    bucketPanel.insert(1, tempLabel);
    // bucketPanel.insert(2, tempLabel);
}; //End Of assignEmptyLabel(i)

// TO assign '>=' symbol before the new or last bucket
assignSymbol = function (i, j) {
    var greaterSymbol = new Ext.form.Label({
        text: '>=',
        itemId: 'greaterField' + i,
        autoid: 'cmsBucketGreaterLabel',
        width: 30
    });
    var emptyLabel1 = new Ext.form.Label({
        itemId: 'ld' + i,
        autoid: 'cmsEmptyLabelAfterPreviousBucket',
        width: 20,
        html: '<pre>  </pre>'
    });
    var Bucket = createBucket(i);
    Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1].add(Bucket);
    var bucketPanel = Ext.ComponentQuery.query("#bucket" + j)[Ext.ComponentQuery.query("#bucket" + j).length - 1]; // + 1));
    bucketPanel.remove(bucketPanel.items.items[1]);
    if (j != 13) {
        bucketPanel.insert(1, greaterSymbol);
    } else {
        bucketPanel.insert(1, emptyLabel1);
    }
    bucketPanel.show();
    buttonCheck();
    Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1].updateLayout();
}; //End Of assignSymbol(i,j)
if (Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1] != undefined) {
    var bucketId = Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1].items.length;
} else {
    var bucketId = 0;
}
// This method creates and returns the bucket. 

buttonCheck = function () {
    var completeForm = Ext.ComponentQuery.query("#formId")[Ext.ComponentQuery.query("#formId").length - 1];
    if (completeForm != undefined) {
        var flag1;
        for (var i = 0; i < completeForm.items.length; i++) {
            if (completeForm.items.items[i].items.items[4].items.items[0].value != "" && completeForm.items.items[i].items.items[4].items.items[0].value != undefined) { //Ext.getCmp('numberField1' +i).getValue()!= ""){ //|| Ext.getCmp('numberField1' +i).getValue()==0 )){  //|| Ext.getCmp('numberField1' +i).getValue()!= '') || (Ext.getCmp('numberField1' +i).getValue()==0)){

                if (completeForm.items.items[i].items.items[2].items.items[0].value == "" && completeForm.items.items[i].items.items[2].items.items[0].value == undefined) {
                    flag1 = false;
                    break;
                } else if (completeForm.items.length == 12) {
                    flag1 = false;
                    break;
                } else if (i == (completeForm.items.length - 1))
                    flag1 = true;
            } else {
                flag1 = false;
                break;
            }
        }
        if (flag1) {
            //Ext.ComponentQuery.query("#button1")[Ext.ComponentQuery.query("#button1").length - 1].enable();
        } else {
            //Ext.ComponentQuery.query("#button1")[Ext.ComponentQuery.query("#button1").length - 1].disable();
        }
    }
};
