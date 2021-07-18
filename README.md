# ArraySerialisation
Serialise an array into a byte representation for network communication.

Useage:
serialise( data: string | number | null | ArrayObject ): Uint8Array

Supported types:
  String
  Numbers (internally packed as a float32)
  Null
