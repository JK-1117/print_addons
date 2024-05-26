let signatureInterval = null

frappe.model.with_doc("Print Addons Settings").then(function (doc) {
    console.log(doc)
    if (doc && doc.hide_signature_underline) {
        signatureInterval = setInterval(hide_signature_underline(), 100)
    }
})

function hide_signature_underline() {
    if (frappe.ui.form.ControlSignature) {
        clearInterval(signatureInterval);
        frappe.ui.form.ControlSignature = class CustomControlSignature extends frappe.ui.form.ControlSignature {
            make_pad() {
                let width = this.body.width();
                if (width > 0 && !this.$pad) {
                    this.$pad = this.body
                        .jSignature({
                            height: 200,
                            color: "var(--text-color)",
                            decorColor: "black",
                            width,
                            lineWidth: 2,
                            backgroundColor: "var(--control-bg)",
                            signatureLine: false,
                        })
                        .on("change", this.on_save_sign.bind(this));
                    this.load_pad();
                    this.$reset_button_wrapper = $(`
                    <div class="signature-btn-row">
                        <a href="#" type="button" class="signature-reset btn icon-btn">
                            ${frappe.utils.icon("es-line-reload", "sm")}
                        </a>
                    </div>
                `)
                        .appendTo(this.$pad)
                        .on("click", ".signature-reset", () => {
                            this.on_reset_sign();
                            return false;
                        });
                    this.refresh_input();
                }
            }
        }
    }
}