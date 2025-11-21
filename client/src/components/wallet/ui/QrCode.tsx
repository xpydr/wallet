
import { QRCodeSVG } from "qrcode.react";

type address = {
  ethHex: string; // Ethereum hexadecimal
}

export default function QrCode(props: address) {
  return (
    <>
      <QRCodeSVG value={props.ethHex} bgColor="cyan" title="QR code of Ethereum address" size={150} level="H" />
    </>
  );
}
