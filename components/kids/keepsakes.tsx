"use client";

import { Barcode, CornerFlourish, FitText, Flourish, HollyDivider, InkStamp, PostageStamp, ToothFairyCrest, WaxSeal, christmasYear, stableNumber } from "./craft";

/**
 * The Kids keepsakes. Each is sized in container units (cqw), so the same
 * markup scales from a phone screen to an A4 or A5 print sheet.
 */
type Keepsake = { recipientName: string; extraDetail: string; customMessage: string };

export function NiceListCertificate({ recipientName, extraDetail }: Keepsake) {
  const year = christmasYear();
  return (
    <div className="kc-sheet">
      <article className="kc-cert" aria-label={`Official Nice List Certificate for ${recipientName}`}>
        {[0, 90, 180, 270].map(deg => <CornerFlourish key={deg} className="kc-cert-corner" style={{ transform: `rotate(${deg}deg)`, [deg === 0 || deg === 270 ? "left" : "right"]: "3.2cqw", [deg < 180 ? "top" : "bottom"]: "3.2cqw" }} />)}
        <p className="kc-eyebrow">North Pole Official Registry</p>
        <h2 className="kc-cert-title">Official <span>Nice List</span> Certificate</h2>
        <HollyDivider className="kc-holly" />
        <p className="kc-cert-lead">This is to certify that</p>
        <FitText fitKey={recipientName} maxLines={1} className="kc-cert-name">{recipientName}</FitText>
        <p className="kc-cert-body">has been checked twice by the High Council of Elves and found to be truly, wonderfully nice, especially for <strong>{extraDetail}</strong>.</p>
        <div className="kc-cert-footer">
          <div className="kc-signature">
            <span className="kc-signature-name">Father Christmas</span>
            <Flourish className="kc-flourish" />
            <span className="kc-signature-role">Chief of the Nice List</span>
          </div>
          <WaxSeal ring="NORTH POLE · NICE LIST · " emblem="star" ribbon className="kc-cert-seal" />
          <div className="kc-signature">
            <span className="kc-signature-name">Bernard</span>
            <Flourish className="kc-flourish" />
            <span className="kc-signature-role">Head Elf, Workshop Reports</span>
          </div>
        </div>
        <p className="kc-cert-number">Certificate No. NP-{year}-{stableNumber(recipientName)} · Christmas {year}</p>
      </article>
    </div>
  );
}

export function SantaLetter({ recipientName, extraDetail, customMessage }: Keepsake) {
  return (
    <div className="kc-sheet">
      <article className="kc-letter" aria-label={`Letter from Father Christmas to ${recipientName}`}>
        <PostageStamp className="kc-letter-stamp" />
        <p className="kc-eyebrow">From the desk of Father Christmas</p>
        <h2 className="kc-letter-greeting">
          <FitText fitKey={recipientName} maxLines={2} className="kc-letter-name">Dear <span>{recipientName}</span>,</FitText>
        </h2>
        <p className="kc-letter-report"><strong>Elves’ Workshop Report:</strong> Bernard the Head Elf told me all about <em>{extraDetail}</em>!</p>
        <p className="kc-letter-message">{customMessage}</p>
        <div className="kc-letter-signoff">
          <div className="kc-signature kc-signature--left">
            <span className="kc-signature-lead">With love and festive magic,</span>
            <span className="kc-signature-name">Father Christmas</span>
            <Flourish className="kc-flourish" />
          </div>
          <WaxSeal ring="NORTH POLE · SEALED · " emblem="tree" className="kc-letter-seal" />
        </div>
      </article>
    </div>
  );
}

export function ToothFairyReceipt({ recipientName, extraDetail, customMessage }: Keepsake) {
  const number = stableNumber(`${recipientName}:${extraDetail}`);
  return (
    <div className="kc-sheet kc-sheet--receipt">
      <article className="kc-receipt" aria-label={`Tooth Fairy receipt for ${recipientName}`}>
        <ToothFairyCrest className="kc-receipt-crest" />
        <h2 className="kc-receipt-title">Queen Celeste’s Tooth Exchange</h2>
        <p className="kc-receipt-sub">Midnight Stardust Department · Receipt No. TF-{number}</p>
        <div className="kc-rule" />
        <p className="kc-receipt-from">Collected from</p>
        <FitText fitKey={recipientName} maxLines={1} className="kc-receipt-name">{recipientName}</FitText>
        <div className="kc-rule" />
        <dl className="kc-lines">
          <div className="kc-line"><dt>1 × baby tooth, collected</dt><dd>✓</dd></div>
          <div className="kc-line kc-line--note"><dt>Inspection note</dt><dd>{extraDetail}</dd></div>
          <div className="kc-line"><dt>Sparkle grade</dt><dd>A+</dd></div>
          <div className="kc-line"><dt>Bravery bonus</dt><dd>★★★</dd></div>
          <div className="kc-line"><dt>Pillow check</dt><dd>Passed</dd></div>
        </dl>
        <div className="kc-rule kc-rule--double" />
        <div className="kc-receipt-total">
          <div className="kc-line kc-line--total"><span>Total</span><span>Stardust ✨</span></div>
          <p className="kc-receipt-tree">+ a real tree planted for the planet 🌱</p>
          <InkStamp lines={["PAID", "WITH THANKS"]} className="kc-receipt-stamp" />
        </div>
        <div className="kc-rule" />
        <p className="kc-receipt-message">{customMessage}</p>
        <div className="kc-signature kc-signature--receipt">
          <span className="kc-signature-name">Queen Celeste</span>
          <Flourish className="kc-flourish" />
          <span className="kc-signature-role">Tooth Fairy, Starlight Castle</span>
        </div>
        <Barcode seed={`TF${number}`} className="kc-barcode" />
        <p className="kc-receipt-thanks">Thank you for brushing so well. Please keep this receipt under your pillow.</p>
      </article>
    </div>
  );
}
