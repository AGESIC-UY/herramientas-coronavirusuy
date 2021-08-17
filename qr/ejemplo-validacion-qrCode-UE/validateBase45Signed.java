    public static String validateBase45Signed(String publicKey, String base45) throws IOException, SignatureException, CertificateException, Exception {
        

        JSONObject response = new JSONObject();
        
        try {
            
            if (base45.startsWith(DGCConstants.DGC_V1_HEADER)) {
               base45 = base45.substring(DGCConstants.DGC_V1_HEADER.length());
              //log.trace("Stripped {} header - Base45 encoding is {} characters long", DGCConstants.DGC_V1_HEADER, input.length());
            }
            else {
              //log.info("Missing header - {}", DGCConstants.DGC_V1_HEADER);
            }

            // Base45 decode into a compressed CWT ...
            //
            //log.trace("Base45 decoding into a compressed CWT ...");
            byte[] compressedCwt = Base45.getDecoder().decode(base45);
            //log.trace("Compressed CWT is {} bytes long", compressedCwt.length);

            // De-compress
            //log.trace("De-compressing the CWT ...");
            if (!Zlib.isCompressed(compressedCwt)) {
              //log.info("The data to inflate is missing ZLIB header byte - assuming un-compressed data");
            }
            byte[] cwt = Zlib.decompress(compressedCwt, false);
            //log.trace("Inflated data into CWT of length {}", cwt.length);

            // OK, we now have the uncompressed CWT, lets verify it ...

            CoseSign1_Object cose = CoseSign1_Object.decode(cwt);

            cose.verifySignature(generatePublicKey(publicKey));

            Cwt cwtVerif = cose.getCwt();

            CBORObject cbor = (CBORObject)cwtVerif.getClaim(99);

            System.out.println(cbor.ToJSONString());

            response.put("Success", "true");
            response.put("MessageError", "");
            response.put("Payload",cbor.ToJSONString());
            
       } catch (IOException | SignatureException | CBORException | JSONException  e) {
            response.put("Success", "false");
            response.put("MessageError", e.getMessage());
            response.put("Payload","");
       }

        return response.toString();
    }